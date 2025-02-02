const translate = require("@vitalets/google-translate-api");

translate("Hello", { to: "es" })
  .then((res) => {
    console.log(res.text); // Output: Hola
  })
  .catch((err) => {
    console.error(err);
  });