
const typeData = document.getElementById("type");
const dataResource = document.getElementById("dataResource");
const hourInput= document.getElementById("timeChange");
const sectionSelect = document.getElementById("section");

document.getElementById("sendData").addEventListener("click", function(){
  dataNewElement(typeData, dataResource, hourInput, sectionSelect);
});

function copyClipboard(idElement) {

  // Selecciona el elemento
  var copyText = document.getElementById(idElement);
  console.log(idElement)
  // copea el contenido
  // copyText.select();
  // copyText.setSelectionRange(0, 99999); /* For mobile devices */

  // Ejecuta la pi HTML5
  navigator.clipboard.writeText(copyText.value);
}

// Envio de la informacion
function dataNewElement(typeData, dataResource, hourInput, sectionSelect) {

  // Validamos que los input contengan datos
  if(dataResource.value === '') {
    alert('Ingrese una url de imagen o id de video!');
    return;
  }
  if(hourInput.value == ''){
      alert('Ingrese una hora!');
      return;
  }

  // Preprara la informacion que va a enviar
  const data = {
      type: typeData.value,
      dataResource: dataResource.value,
      hour: hourInput.value,
      section: sectionSelect.value
  };

  // envia la informacion
  sendData(data)

  // Reset de los inputs
  dataResource.value = '';
  hourInput.value = '';

}
