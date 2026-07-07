/**
 * Uploads a file to Cloudinary using unsigned upload (no backend required).
 *
 * Requirements:
 *   1. Cloudinary account: olt18cmg
 *   2. Create an unsigned upload preset named "portfolio_attachments":
 *      cloudinary.com → Settings → Upload → Upload presets → Add upload preset
 *      - Signing mode: Unsigned
 *      - Folder: hire-me
 *
 * Returns the secure_url of the uploaded file.
 */

const CLOUD_NAME    = 'olt18cmg'
const UPLOAD_PRESET = 'portfolio_attachments'  // must be unsigned

export async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData()
  form.append('file',         file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder',        'hire-me')
  form.append('resource_type', 'auto')  // supports PDF, DOC, images, etc.

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: form }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message: string } }).error?.message ?? `Upload failed (${res.status})`)
  }

  const data = await res.json() as { secure_url: string }
  return data.secure_url
}
