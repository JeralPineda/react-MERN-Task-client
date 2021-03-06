import { useReducer, useRef } from 'react';

import proyectoContext from './projectContext';
import proyectoReducer from './projectReducer';
import { FORMULARIO_PROYECTO, OBTENER_PROYECTOS, VALIDAR_FORMULARIO, PROYECTO_ACTUAL, ELIMINAR_PROYECTO, AGREGAR_PROYECTO, PROYECTO_ERROR } from '../../types';
import { fetchConToken } from '../../helpers/fetch';

const ProyectoState = ({ children }) => {
   const initialState = {
      proyectos: [],
      formulario: false,
      errorformulario: false,
      proyecto: null,
      mensaje: null,
   };

   // Dispatch para ejecutar las acciones
   const [state, dispatch] = useReducer(proyectoReducer, initialState);

   // Serie de funciones para el CRUD
   const mostrarFormulario = () => {
      dispatch({
         type: FORMULARIO_PROYECTO,
      });
   };

   // Obtener los proyectos
   const obtenerProyectos = async () => {
      const resp = await fetchConToken('proyectos');

      const body = await resp.json();

      if (body.ok) {
         dispatch({
            type: OBTENER_PROYECTOS,
            payload: body.proyectos,
         });
      } else {
         const alerta = {
            msg: body.msg,
            categoria: 'alerta-error',
         };

         dispatch({
            type: PROYECTO_ERROR,
            payload: alerta,
         });
      }
   };

   // Agregar nuevo proyecto
   const agregarProyecto = async (proyecto) => {
      //    Petición crear proyecto
      const resp = await fetchConToken('proyectos', proyecto, 'POST');

      const body = await resp.json();

      if (body.ok) {
         // Insertar el proyecto en el state
         dispatch({
            type: AGREGAR_PROYECTO,
            payload: body.proyecto,
         });
      } else {
         const alerta = {
            msg: body.msg,
            categoria: 'alerta-error',
         };

         dispatch({
            type: PROYECTO_ERROR,
            payload: alerta,
         });
      }
   };

   // Validar el formulario por errores
   const mostrarErrorProyecto = () => {
      dispatch({
         type: VALIDAR_FORMULARIO,
      });
   };

   // Selecciona el proyecto que el usuario dio click
   const proyectoActual = (proyectoId) => {
      dispatch({
         type: PROYECTO_ACTUAL,
         payload: proyectoId,
      });
   };

   // Eliminar un proyecto
   const eliminarProyecto = async (proyectoId) => {
      const resp = await fetchConToken(`proyectos/${proyectoId}`, {}, 'DELETE');

      const body = await resp.json();

      if (body.ok) {
         dispatch({
            type: ELIMINAR_PROYECTO,
            payload: proyectoId,
         });
      } else {
         const alerta = {
            msg: body.errors ? body.errors.id.msg : body.msg, //condicional para extraer msg de express-validator
            categoria: 'alerta-error',
         };

         dispatch({
            type: PROYECTO_ERROR,
            payload: alerta,
         });
      }
   };

   // Referencia al dom, para el error de strict mode react dom
   const nodeRef = useRef(null);

   return (
      <proyectoContext.Provider
         //
         value={{
            proyectos: state.proyectos,
            formulario: state.formulario,
            errorformulario: state.errorformulario,
            proyecto: state.proyecto,
            mensaje: state.mensaje,
            mostrarFormulario,
            obtenerProyectos,
            agregarProyecto,
            mostrarErrorProyecto,
            proyectoActual,
            eliminarProyecto,
            nodeRef,
         }}>
         {children}
      </proyectoContext.Provider>
   );
};

export default ProyectoState;
