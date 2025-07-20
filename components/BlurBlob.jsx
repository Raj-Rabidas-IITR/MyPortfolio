import React from 'react';
import propTypes from 'prop-types';

const BlurBlob = ({position, size}) => {

  const {top, left} = position
  const {width, height} = size

  return (
    <div className='absolute'
    style={{
        top:top,
        left:left,
        width: width,
        height: height,
        transform: 'translate(-50%, -50%)'
    }}>
      <div className='w-full h-full bg-cyan-400 rounded-full opacity-20 blur-3xl animate-blob'>

      </div>
    </div>
  );
};

//define prop types

BlurBlob.propTypes = {
  position: propTypes.shape({
    top: propTypes.string,
    left: propTypes.string
  }),
  size: propTypes.shape({
    width:propTypes.string,
    height:propTypes.string
  })
}

export default BlurBlob;