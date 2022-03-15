//Toast Bienvenida
Toastify({
    text: "Bienvenido",
    className:"success",
        duration: 3000,
        position: "center",
        style:{
                background: "rgb(22, 73, 156)",
                color: "rgb(255, 255, 255)",
                border: "1px solid lightblue",
                borderRadius: "20px",
                fontSize: "25px",
              }
    }).showToast();



// Toast de Compra
const dynamicToastify = (e) => {

    if (e.target.classList.contains('btn-dark')) {
  
      Toastify({
        text: "Producto agregado",
        className:"success",
        duration: 3000,
        position: "center",
        style:{
                background: "rgb(22, 73, 156)",
                color: "rgb(255, 255, 255)",
                border: "1px solid lightblue",
                borderRadius: "20px",
                fontSize: "25px",
              }
        
        }).showToast();
  
      }
  }