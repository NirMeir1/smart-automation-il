// Offline media preparation: no FFmpeg or blur work is needed in the browser.
// https://ffmpeg.org/ffmpeg-filters.html#gblur
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const fromRoot = path => fileURLToPath(new URL(`../${path}`, import.meta.url))
const localFFmpeg = fromRoot('.tools/ffmpeg/package/ffmpeg.exe')
const ffmpeg = process.env.FFMPEG_PATH || (existsSync(localFFmpeg) ? localFFmpeg : 'ffmpeg')
const source = fromRoot('public/videos/founder-introduction.mp4')
const output = fromRoot('public/videos/founder-introduction-blurred.mp4')
const poster = fromRoot('public/videos/founder-introduction-poster-blurred.webp')

// Measured against this owner's 720×1280 footage. The watermark occupies the
// lower-right corner, below the Hebrew subtitles. Re-measure for new footage.
// Feather the patch over 8px so its edges blend into the surrounding picture.
const blur = [
  '[0:v]split[base][patch]',
  "[patch]crop=280:88:408:1168,gblur=sigma=16:steps=2,format=yuva420p,geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='255*clip(min(min(X,W-1-X),min(Y,H-1-Y))/8,0,1)'[blurred]",
  '[base][blurred]overlay=408:1168:format=auto,format=yuv420p[out]',
].join(';')

function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'warning', '-nostdin', ...args], {
    stdio: 'inherit', windowsHide: true,
  })
  if (result.error) throw new Error('FFmpeg is required. Install it locally or set FFMPEG_PATH to its executable.', { cause: result.error })
  if (result.status !== 0) throw new Error(`FFmpeg failed with exit code ${result.status}`)
}

if (!existsSync(source)) throw new Error(`Missing original footage: ${source}`)
run([
  '-i', source, '-filter_complex', blur, '-map', '[out]', '-map', '0:a?',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
  '-vsync', '0', '-c:a', 'copy', '-map_metadata', '0', '-movflags', '+faststart', '-y', output,
])
run([
  '-ss', '0.3', '-i', output, '-frames:v', '1', '-an',
  '-c:v', 'libwebp', '-quality', '88', '-y', poster,
])
console.log('Prepared founder video and poster with a localized watermark blur. Originals preserved.')
