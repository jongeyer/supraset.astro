export function uuid() {
  return crypto.randomUUID()
}
export function uuidAlpha() {
  return crypto.randomUUID().replace(/[^a-zA-Z]/g, '')
}
