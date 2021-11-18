# This folder can store static images to be served by the backend on the web


>Example:
>If you want to crate images for diagnostics and allow them to be accessed from backend URL:
images\diags\farm\mydiagnosis.png"
>The access url for this image will be:
https://mygcpappurl.com/images/diags/farm/mydiagnosis.png

- The images on this folder are served by using the ImageServiceMiddleware, more configurations and filters can be setup by modifying the imageservice.middleware.ts file.
