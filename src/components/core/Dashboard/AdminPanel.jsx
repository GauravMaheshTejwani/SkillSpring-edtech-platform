import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { createCategory } from '../../../services/operations/courseDetailsAPI';

const AdminPanel = () => {

  const { token } = useSelector((state)=> state.auth);
  const [category, setCategory] = useState({
    name:'',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!category.name || !category.description){
      return;
    }

    await createCategory({
      name: category.name,
      description: category.description,
    }, token);

  }

  return (
    <div className=' text-gray-300 text-xl p-5 max-w-[1000px] w-11/12 mx-auto'>
      <form onClick={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='category'>category Name</label>
          <input
          value={category.name}
          onChange={(e)=> setCategory({...category, name:e.target.value})}
          type='text'
          name='category'
          id='category'
          className='form-style'
          placeholder='Enter Category Name'
          ></input>
        </div>

        <div className='flex flex-col gap-2 mt-10'>
          <label htmlFor='category'>Category Description</label>
          <textarea 
          value={category.description}
          onChange={(e)=> setCategory({...category, description: e.target.value})}
          type="text"
          name='category'
          id='category'
          className='form-style'
          placeholder='Enter Category Description'
          />
        </div>

        <button 
        type='submit'
        className=" mt-10 rounded-md bg-yellow-400 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-gray-500 sm:text-[16px] "
        >Create</button>
      </form>
    </div>
  )
}

export default AdminPanel