import { useParams, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from "../../utils/axiosClient";

function AdminUpload() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, reset } = useForm();
  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    if (!data.videoFile?.[0]) return;

    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // 1️⃣ Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // 2️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // 3️⃣ Save video metadata (Option 1: title from problem)
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
      setUploadProgress(0);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Upload Video Solution</h2>

          {/* Back Button */}
          <button
            className="btn btn-sm btn-ghost mb-4"
            onClick={() => navigate('/admin/video')}
          >
            ← Back to Videos
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* File Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose video file</span>
              </label>
              <input
                type="file"
                accept="video/*"
                {...register('videoFile', { required: true })}
                className="file-input file-input-bordered w-full"
                disabled={uploading}
              />
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Selected File:</h3>
                  <p>{selectedFile.name}</p>
                  <p>Size: {formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-sm mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Uploaded Video Info */}
            {uploadedVideo && (
              <div className="alert alert-success space-y-2">
                <h3 className="font-bold">Upload Successful!</h3>
                <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                <p>Status: {uploadedVideo.status}</p>
                {uploadedVideo.thumbnailUrl && (
                  <img src={uploadedVideo.thumbnailUrl} alt="Video thumbnail" className="w-32 mt-2 rounded" />
                )}
              </div>
            )}

            {/* Upload Button */}
            <div className="card-actions justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`btn btn-primary ${uploading ? 'loading' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
