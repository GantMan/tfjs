/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {NamedTensorInfoMap, registerKernel, TensorInfo, util} from '@tensorflow/tfjs-core';

import {BackendWasm} from '../backend_wasm';

interface AbsInputs extends NamedTensorInfoMap {
  x: TensorInfo;
}

let wasmAbs: (xId: number, outId: number) => void;

function setup(backend: BackendWasm): void {
  wasmAbs = backend.wasm.cwrap('Abs', null /* void */, ['number', 'number']);
}

function abs(args: {backend: BackendWasm, inputs: AbsInputs}): TensorInfo {
  const {backend, inputs: {x}} = args;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;

  // Short-circuit zero-sized tensors.
  if (util.sizeFromShape(out.shape) === 0) {
    return out;
  }

  wasmAbs(xId, outId);
  return out;
}

registerKernel({
  kernelName: 'Abs',
  backendName: 'wasm',
  setupFunc: setup,
  kernelFunc: abs
});
