export function getDriveId(url) {
  const m = url?.match(/drive\.google\.com\/file\/d\/([^/?]+)/)
  return m ? m[1] : null
}

export function getVideoEmbed(url) {
  if (!url) return null
  const driveId = getDriveId(url)
  if (driveId) return { type: 'iframe', src: `https://drive.google.com/file/d/${driveId}/preview` }
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1` }
  return { type: 'video', src: url }
}

export function getThumbnailUrl(url) {
  if (!url) return null
  const driveId = getDriveId(url)
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`

  if (url.startsWith('/uploads/')) {
    const fileName = url.split('/').pop()
    return `/project-thumbnails/${fileName}`
  }

  return url
}
