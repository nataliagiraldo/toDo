let tareasGuardadas = [
    {
        id: "123",
        tarea: "hola",
        fechaInicio: "idk",
        fechaFin: "idk",
        encargado: "idk",
        status: "pendiente",
        prioridad: "idk"
    },
    {
        id: "124",
        tarea: "Comprar papas",
        fechaInicio: "idk",
        fechaFin: "idk",
        encargado: "idk",
        status: "pendiente",
        prioridad: "idk"
    },
    {
        id: "125",
        tarea: "malisimo",
        fechaInicio: "idk",
        fechaFin: "idk",
        encargado: "idk",
        status: "failed",
        prioridad: "idk"
    }

];

const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getTarea = async (id) => {
    // try {
    //     const respuesta = await fetch(`${URL_API}/product`);

    // 	if(respuesta.status === 200){
    // 		const datos = await respuesta.json();
    //         viewDataHtml(datos);
    // 	} else if(respuesta.status === 401){
    //         console.log('La url no es correcta');
    // 	} else if(respuesta.status === 404){
    //         console.log('El producto que buscas no existe');
    // 	} else {
    //         console.log('Se presento un error en la peticion consulte al Administrador');
    // 	} 
    // } catch(error){
    //     console.log(error);
    // }

    for (let tarea in tareasGuardadas) {
        if (tarea.id == id)
            return tarea;
    }

}

const getAllTareas = async () => {
    return tareasGuardadas;

    //en un futuro apuntaría a la API

}

//crear tarea
const postTarea = async (datos) => {

    // fetch(`${URL_API}/product`,
    // {
    // 	method: "POST",
    // 	headers: myHeaders,
    // 	body:JSON.stringify(datos)
    // }
    // ).then(res=>{
    //     return res.json()
    // }).then(res=>{
    //     //idUser=res.id;
    // }).catch(err=>{
    //     console.log(err);
    // })
    console.log("posting" + datos + datos.tarea)
    tareasGuardadas.push(datos);
}

//modificar tarea
const putTarea = (datos, id) => {

    // fetch(`${URL_API}/product/${id}`,
    // {
    // 	method: "PUT",
    // 	headers: myHeaders,
    // 	body:JSON.stringify(datos)
    // }
    // ).then(res=>{
    //     return res.json()
    // }).then(res=>{
    //     //idUser=res.id;
    // }).catch(err=>{
    //     console.log(err);
    // })
    console.log("datos "+datos);
    for (let i of tareasGuardadas) {
        if (i.id == id) {
            i = datos
        }
    }

}
export {
    getTarea as getTarea,
    getAllTareas as getAllTareas,
    postTarea as postTarea,
    putTarea as putTarea
};