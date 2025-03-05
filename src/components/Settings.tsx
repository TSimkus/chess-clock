import React, { FormEvent, useState } from 'react';
import { SettingsState, TimeControl } from '../constants'

interface Props {
  closeSettings: () => void,
  settings: SettingsState,
  onSubmit: (settings: SettingsState) => void,
}

const timeControlOptions: TimeControl[] = [ 1, 3, 5, 10 ];

export default function Settings({closeSettings, settings, onSubmit}: Props) {
  
  const [formData, setFormData] = useState<SettingsState>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData)
    closeSettings();
  }

  return (
    <div className='bg-gray-100/90 w-screen h-screen absolute top-0 left-0 flex justify-center items-center'> 

      <div className="bg-white shadow-md rounded-md p-5 relative">

        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-5">
          <div>
            <label className="flex gap-5 border border-gray-200 rounded-sm px-3 py-2 items-center">Time control:
              <select 
                name="timeControl"
                className="border-b border-b-gray-400 p-2"
                onChange={handleChange}
                value={formData.timeControl}
              >
                {timeControlOptions.map(duration => (
                  <option key={duration} value={duration} >{duration} min.</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="px-3 py-2 bg-emerald-600 rounded-sm text-white"
            >Save</button>
            <button 
              type="button"
              className="px-3 py-2 bg-rose-600 rounded-sm text-white"
              onClick={closeSettings}
            >Close</button>
          </div>

        </form>

      </div>

    </div>
  )
}
