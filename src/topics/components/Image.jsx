import React from 'react';

const Img = ({ record }) => {
  if (!record.topicImageUrl) {
    return null;
  }

  return (
    <div>
      <img style={{ maxWidth: '150px' }} src={record.topicImageUrl} alt="topic" />
    </div>
  );
};

export default Img;
