import React from 'react'
import Header from '../Components/Header'
import AnimatedBackground from '../animation'

const Home = () => {
    return (
        <>
            <Header />
            <div class="w-screen h-screen bg-[conic-gradient(from_0deg,rgba(0,255,200,0.15),rgba(0,255,255,0.05),transparent,rgba(0,255,200,0.1))]">
                <AnimatedBackground />
            </div>

        </>
    )
}

export default Home
