const AdmZip = require('adm-zip');
const zip = new AdmZip();
zip.addLocalFile(__dirname + '/../public/resubeat-wordpress-plugin.php');
zip.writeZip(__dirname + '/../public/resubeat.zip');
console.log("Zip file created.");
