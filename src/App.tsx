import { useState,useReducer } from 'react'
import './App.css'

type GerenciadorTarefa = | { type:"add", titulo:string } | {type:"remove", id:number} | {type:"status", id:number} | {type:"filter", filter:string};

type Tarefa = {
  id:number,
  titulo:string;
  concluida:boolean;
}

function reducer(state:Tarefa[],action:GerenciadorTarefa){
  switch(action.type){
    case 'add':
      return  [

          ...state,
          {id:Math.random(),titulo:action.titulo,concluida:false}
      ]
    case 'remove':
    return state.filter((task) => task.id !== action.id);

    case 'status':{

      const copyTask = state.filter((task) => task.id === action.id);
      const copyState = state.filter((task) => task.id !== action.id);
      
      return [...copyState, {id:copyTask[0].id,titulo:copyTask[0].titulo,concluida:!copyTask[0].concluida}];
    }

  }
}


function App() {
  const [input, setInput] = useState("");

  const [filterTarefas,setFilterTarefas] = useState<Tarefa[]>([]);

  const initialStateTarefa:Tarefa []= [];

  const [state,dispatch] = useReducer(reducer,initialStateTarefa);


  function atualizaTasks(event:React.ChangeEventHandler<HTMLSelectElement> |  any){
    const value = event.target.value ;
    if(value === 'todas'){
      setFilterTarefas(state);
    }else if(value === 'ativas'){
      const filtragem = state.filter((task)=> task.concluida === false);
      setFilterTarefas(filtragem);
    }else if(value === 'concluida'){
      const filtragem = state.filter((task)=> task.concluida === true);
      setFilterTarefas(filtragem);
    }
    }


  function addTask(){

    dispatch({type:"add",titulo:input})
  }

  function removeTask(id:number){
    dispatch({type:"remove",id})
  }

  return (
    <div className=''>
      <div className='m-10'>
        <h1 className='m-4'>Gerenciador de tarefas</h1>
        <input className='w-50 h-10 b-2 outline-1 outline-white rounded p-1 m-2' type="text" placeholder='Digite o nome da tarefa' onChange={(e)=>setInput(e.target.value)}/>
        <button onClick={addTask} className='outline-1 outline-white'>Adicionar</button>

        <ul className=' flex flex-col gap-2 '>
          {state.map((task)=>(
            <li key={task.id} className='flex items-center justify-center gap-5'>
              <button className=' flex  bg-green-400 text-white font-bold rounded h-8 w-30 items-center justify-center rounded text-xs'
              onClick={()=>dispatch({type:'status',id:task.id})}>
                {`${task.concluida ? "Concluída" : "Não Concluída"}`}</button>
              <span className=' flex  bg-white text-black h-10 w-30 items-center justify-center rounded' >{task.titulo} </span>
              <button className='h-8 flex items-center justify-center bg-red-500' onClick={()=>removeTask(task.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className='m-4'>Listagem de Tarefas</h1>

        <div className='flex flex-col items-center gap-2 '>
          <select name="" id="" className='bg-zinc-800 w-40 outline-1 outline-white rounded' onChange={atualizaTasks}>
            <option value="todas" >Todas</option>
            <option value="ativas" >Ativas</option>
            <option value="concluida">Concluídas</option>
          </select>

          <ul className='flex flex-col w-100 gap-2'>

            {filterTarefas.map((task)=>(
              <li key={task.id} className='flex items-center justify-start outline-1 outline-white rounded p-2'>
                  <span>Tarefa: {task.titulo}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  )
}

export default App
