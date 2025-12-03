import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { TreeMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<TreeMode>(TreeMode.ASSEMBLED);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Scene mode={mode} />
      <UI mode={mode} setMode={setMode} />
    </div>
  );
};

export default App;