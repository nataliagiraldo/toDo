import { getAllTareas as getAllTareas, postTarea as postTarea, putTarea as putTarea } from "./api.js"
let ListaPendientes, ListaHechos, ListaFallados

async function cargarDatos() {
    console.log("entró en cargarDatos")
    let tareasGuardadas = await getAllTareas()
    console.log("obtuvo datos: " + tareasGuardadas)

    let done = [], fail = [], pending = [];

    for (let i of tareasGuardadas) {
        console.log("mirando " + i.status)
        switch (i.status) {
            case "pendiente":
                pending.push(i);
                break;
            case "done":
                done.push(i);
                break;
            case "failed":
                fail.push(i);
                break;
        }
    }

    ListaPendientes = await document.getElementById('listaPendiente')
    if (ListaPendientes) {
        ListaPendientes.setTareas(pending)
    }
    console.log("listapendiente" + ListaPendientes)

    ListaHechos = await document.getElementById('listaHecho')
    if (ListaHechos) {
        ListaHechos.setTareas(done)
    }
    ListaFallados = await document.getElementById('listaFallo')
    if (ListaFallados) {
        ListaFallados.setTareas(fail)
    }


}
cargarDatos()

async function crearTarea(event) {
    event.preventDefault();

    const tarea = document.getElementById('tareaNueva').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const encargado = document.getElementById('encargado').value;
    const prioridad = document.getElementById('prioridad').value;
    const idAleatorio = Math.floor(Math.random() * 1000);

    const tareaObjeto = {
        id: idAleatorio,
        tarea: tarea,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        encargado: encargado,
        status: 'pendiente',
        prioridad: prioridad
    };

    await postTarea(tareaObjeto)
    if(ListaPendientes){
        ListaPendientes.addTarea(tareaObjeto)
    }
}

const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', (e) => crearTarea(e));

class Tarea extends HTMLElement {
    constructor() {
        super();

    }
    connectedCallback() {
        this.isModifyable = this.getAttribute("modify") == "true"
        this.tarea = this.getAttribute("tarea");
        this.fechaInicio = this.getAttribute("fechaInicio");
        this.fechaFin = this.getAttribute("fechaFin");
        this.encargado = this.getAttribute("encargado");
        this.prioridad = this.getAttribute("prioridad");
        this.status = this.getAttribute("status");
        this.id = this.getAttribute("id");
        this.render();
        console.log("mi nombre es " + this.tarea)
    }

    setJson(JSON) {
        this.json = JSON;
    }

    render() {

        this.innerHTML = `
                <li>${this.tarea} 
                ${this.isModifyable ?
                `<div class="check">
                        <form id="done${this.id}">
                            <input type="radio" name="doneFailed" value="Done"> 
                        </form>
                        <form id="fail${this.id}">
                            <input id="Fail" type="radio" name="doneFailed" value="Fail">
                        </form> 
                    </div>` : ""
            }
                </li>
            
        `;

        let markDone = document.querySelector(`#${'done' + this.id}`);
        if (markDone) {
            markDone.addEventListener("click", () => {
                //sacar tarea de pendientes
                if (ListaPendientes) {
                    ListaPendientes.removeTarea(this.json.id)
                }
                //añadir tarea a la lista correspondiente
                if (ListaHechos) {
                    ListaHechos.addTarea(this.json)
                }
                //modificar tarea en json
                this.json['status'] = "done"
                putTarea(this.json, this.json.id)
            });
        }

        let markFail = document.querySelector(`#${'fail' + this.id}`);
        if (markFail) {
            markFail.addEventListener("click", () => {
                //sacar tarea de pendientes
                if (ListaPendientes) {
                    ListaPendientes.removeTarea(this.json.id)
                }
                //añadir tarea a la lista correspondiente
                if (ListaFallados) {
                    ListaFallados.addTarea(this.json)
                }
                //modificar tarea en json
                this.json['status'] = "done"
                putTarea(this.json, this.json.id)
            });
        }
    }
}
customElements.define("tarea-tarea", Tarea);



class ListaTareas extends HTMLElement {
    constructor() {
        super()
        this.titulo = this.getAttribute("titulo");
        this.isModifyable = this.getAttribute("modifyable") == "true";
        this.render();
    }


    setTareas(tareas) {
        console.log("holi jeje");
        this.tareas = tareas;
        this.render()
    }

    addTarea(tarea) {
        this.tareas.push(tarea)
        this.render()
    }

    removeTarea(id) {
        let found = false, remove, i = 0;
        while (i < this.tareas.length && !found) {
            if (this.tareas[i].id == id) {
                found = true;
                remove = i
            }
            i++;
        }
        this.tareas = this.tareas.splice(i, i)
        this.render()
    }

    render() {
        this.innerHTML = /*HTML*/ `
        <div class="pendingTasks">
        <div class="tareasPendientesTitulo">
            <h3 class="tituloListaTareas">${this.titulo}</h3>
            ${this.isModifyable ?
                `<div class="hechoFallido">
                    <p>Hecho</p><br>
                    <p>Fallido</p>
                </div>` : ""
            }
        </div>
            <div class="tareaContainer">
        </div>`;

        const listaTareasContainer = this.querySelector(".tareaContainer");

        if (this.tareas != null) {
            this.tareas.forEach(tarea => {
                const tareaElement = document.createElement("tarea-tarea"); //constructor
                tareaElement.setAttribute("tarea", tarea.tarea);
                tareaElement.setAttribute("modify", this.isModifyable);

                tareaElement.setAttribute("fechaInicio", tarea.fechaInicio);
                tareaElement.setAttribute("fechaFin", tarea.fechaFin);
                tareaElement.setAttribute("encargado", tarea.encargado);
                tareaElement.setAttribute("prioridad", tarea.prioridad);
                tareaElement.setAttribute("status", tarea.status);
                tareaElement.setAttribute("id", tarea.id);

                tareaElement.setJson(tarea)
                listaTareasContainer.appendChild(tareaElement); //connectedcallback

            });
        }
    }

}
customElements.define("lista-tareas", ListaTareas);





