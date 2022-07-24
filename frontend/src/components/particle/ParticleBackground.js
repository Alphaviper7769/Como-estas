import React from 'react';
import ParticleConfig from './ParticleConfig';
import Particles from 'react-tsparticles';

const ParticleBackground = () => {
    return (
        <Particles params={ParticleConfig}></Particles>
    );
};

export default ParticleBackground;