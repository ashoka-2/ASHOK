// Polyfill WebGL methods to protect against null dereferences in headless/software environments
if (typeof window !== 'undefined') {
  const patchGL = (proto) => {
    if (!proto) return;
    if (proto.getShaderPrecisionFormat) {
      const origPrec = proto.getShaderPrecisionFormat;
      proto.getShaderPrecisionFormat = function (shaderType, precisionType) {
        try {
          const res = origPrec.call(this, shaderType, precisionType);
          if (res && typeof res.precision === 'number') return res;
        } catch {}
        return { rangeMin: 1, rangeMax: 1, precision: 23 };
      };
    }
    if (proto.getParameter) {
      const origParam = proto.getParameter;
      proto.getParameter = function (param) {
        try {
          const res = origParam.call(this, param);
          if (res !== null && res !== undefined) return res;
        } catch {}
        if (param === this.VERSION) return 'WebGL 2.0 (OpenGL ES 3.0 Chromium)';
        if (param === this.SCISSOR_BOX || param === this.VIEWPORT) return new Int32Array([0, 0, 1440, 900]);
        if (param === this.MAX_COMBINED_TEXTURE_IMAGE_UNITS) return 16;
        return null;
      };
    }
  };
  if (typeof WebGLRenderingContext !== 'undefined') patchGL(WebGLRenderingContext.prototype);
  if (typeof WebGL2RenderingContext !== 'undefined') patchGL(WebGL2RenderingContext.prototype);
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
