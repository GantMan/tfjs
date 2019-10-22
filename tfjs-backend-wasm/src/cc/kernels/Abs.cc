/* Copyright 2019 Google Inc. All Rights Reserved.
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
 * ===========================================================================*/

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#include <math.h>

#include "src/cc/backend.h"

namespace tfjs {
namespace wasm {
// We use C-style API to interface with Javascript.
extern "C" {

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void Abs(int x_id, int out_id) {
  const TensorInfo a_info = backend::get_tensor_info(x_id);
  const TensorInfo out_info = backend::get_tensor_info(out_id);

  const float* a_buf = a_info.buf.f32;
  float* out_buf = out_info.buf.f32;

  for (int i = 0; i < a_info.size; ++i) {
    out_buf[i] = abs(a_buf[i]);
  }
}

}  // extern "C"
}  // namespace wasm
}  // namespace tfjs
