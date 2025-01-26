using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace EXE201_2RE_API.Helpers
{
    public class QRCodeRequest
    {
        public int acqId { get; set; }
        public string accountNo { get; set; }
        public string accountName { get; set; }
        public int amount { get; set; }
        public string logo { get; set; }
        public string addInfo { get; set; }
        public string template { get; set; }
        public string theme { get; set; }

        public static string ImageToBase64(Image image, ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 string
                string base64String = Convert.ToBase64String(imageBytes);

                // Get the appropriate MIME type
                string mimeType = GetMimeType(format);

                // Return the Base64 string with the MIME type prefix
                return $"data:{mimeType};base64,{base64String}";
            }
        }

        private static string GetMimeType(ImageFormat format)
        {
            return format switch
            {
                var f when f.Equals(ImageFormat.Jpeg) => "image/jpeg",
                var f when f.Equals(ImageFormat.Png) => "image/png",
                var f when f.Equals(ImageFormat.Bmp) => "image/bmp",
                var f when f.Equals(ImageFormat.Gif) => "image/gif",
                var f when f.Equals(ImageFormat.Tiff) => "image/tiff",
                _ => throw new ArgumentOutOfRangeException(nameof(format), "Unknown image format")
            };
        }

        public static Image Base64ToImage(string base64String)
        {
            byte[] imageBytes = Convert.FromBase64String(base64String);
            MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length);
            ms.Write(imageBytes, 0, imageBytes.Length);
            System.Drawing.Image image = System.Drawing.Image.FromStream(ms, true);
            return image;
        }

        public static IFormFile ConvertBase64ToIFormFile(string base64String, string fileName)
        {
            // Remove the header if present (like "data:image/png;base64,")
            var base64Data = base64String.Substring(base64String.IndexOf(",") + 1);
            byte[] fileData = Convert.FromBase64String(base64Data);

            var stream = new MemoryStream(fileData);
            return new FormFile(stream, 0, stream.Length, fileName, fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png" // Set the appropriate content type
            };
        }
    }

    public class Data
    {
        public int acpId { get; set; }
        public string accountName { get; set; }
        public string qrCode { get; set; }
        public string qrDataURL { get; set; }
    }

    public class ApiResponse
    {
        public string code { get; set; }
        public string desc { get; set; }
        public Data data { get; set; }
    }
}
