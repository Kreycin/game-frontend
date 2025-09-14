// src/components/CharacterSheetSkeleton.jsx
import React from 'react';
import '../styles/Skeleton.css';
import '../App.css'; // Import App.css เพื่อใช้ layout grid

const SkeletonElement = ({ type }) => <div className={`skeleton ${type}`}></div>;

const CharacterSheetSkeleton = () => {
  return (
    <div className="App">
      <div className="character-sheet-container">
        <div className="layout-header">
          <SkeletonElement type="title" />
          <SkeletonElement type="text" />
        </div>
        <div className="layout-art">
          <SkeletonElement type="art" />
        </div>
        <div className="layout-main-stats">
          <SkeletonElement type="panel" />
        </div>
        <div className="layout-special-stats">
          <SkeletonElement type="panel" />
        </div>
        <div className="layout-skills">
          <SkeletonElement type="skills" />
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetSkeleton;