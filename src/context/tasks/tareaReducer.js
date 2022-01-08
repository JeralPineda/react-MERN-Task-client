import { TAREAS_PROYECTO, AGREGAR_TAREA, VALIDAR_TAREA, ELIMIANAR_TAREA } from '../../types';

const TareaReducer = (state, action) => {
   switch (action.type) {
      case TAREAS_PROYECTO:
         return {
            ...state,
            tareasproyecto: state.tareas.filter((tarea) => tarea.proyectoId === action.payload),
         };
      case AGREGAR_TAREA:
         return {
            ...state,
            tareas: [...state.tareas, action.payload],
            errortarea: false,
         };
      case VALIDAR_TAREA:
         return {
            ...state,
            errortarea: true,
         };
      case ELIMIANAR_TAREA:
         return {
            ...state,
            tareas: state.tareas.filter((tarea) => tarea.id !== action.payload),
         };
      default:
         return state;
   }
};

export default TareaReducer;
