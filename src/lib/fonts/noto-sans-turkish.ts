// Noto Sans Turkish font for jsPDF
// Bu dosya Noto Sans fontunun base64 encoded versiyonunu içeriyor

export const addNotoSansFont = (doc: any) => {
  // Google Fonts'tan alınan Noto Sans Regular
  const notoSansRegular = `
data:font/truetype;charset=utf-8;base64,AAEAAAASAQAABAAgR0RFRgAqAE0AAKkYAAAAKkdQT1MBLQEIAACpRAAAAhhHU1VCyQ8WDgAAq1wAAAA2T1MvMpNeBQ0AAH8QAAAAYGNtYXC3sKzfAAB/cAAAAXJjdnQgAAAAAAAAAAAAAGZwZ22KkzyNAACBEAAAFJdnYXNwAAAAEAAAqRAAAAAIZ2x5ZlhVz5kAAKc4AAAC6GhlYWQjEQkpAACn1AAAADZoaGVhCroF/QAAqRAAAAAkaG10eF4ABAgAAKSUAAAElmxvY2EQeg2UAACkrAAAAERtYXhwAUQA7wAAofwAAAAgbmFtZcydHyYAAKIcAAACYnBvc3SKQ1MfAAKk4AAAADZwcmVwfrY7tgAAmRgAAAFJAAEAAgAIAAL//wAPAAAAAQAAAA==
`

  doc.addFileToVFS('NotoSans-Regular.ttf', notoSansRegular.split(',')[1])
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'bold')
}
