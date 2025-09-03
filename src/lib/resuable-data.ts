export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image", "video"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [
      {
        color: [
          "#000000",
          "#e60000",
          "#ff9900",
          "#ffff00",
          "#008a00",
          "#0066cc",
          "#9933ff",
          "rgb(255, 0, 255)",
          "rgb(0, 255, 255)",
          "#ffffff",
          "#C99BFD",
          "#8574F6",
        ],
      },
      { background: [] },
    ],
    ["clean"],
    ["paragraph"],
    [{ align: [] }],
    [{ font: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
  ],
};

export const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "font",
  "align",
  "color",
  "background",
  "header",
  "indent",
  "size",
  "script",
  "clean",
  "code",
  "direction",
];

// export const baseAddr = "https://api.ravallusion.com";
export const baseAddr = "http://localhost:4000";
// export const baseAddr = "https://revallusion.onrender.com";

export const cdnAddr = "https://d2b1ol8c9bt133.cloudfront.net";
