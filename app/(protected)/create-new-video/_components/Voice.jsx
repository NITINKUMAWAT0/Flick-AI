'use client'
import React, { useState } from 'react'

const VoiceOptions = [
    {
        'value': "af_sarah",
        'name': "Sarah (Female)"
    },
    {
        'value': "af_sky",
        'name': "Sky (Female)"
    },
    {
        'value': "am_adam",
        'name': "Adam (Male)"
    },
    {
        'value': "hf_omega",
        'name': "Mohit (Male)"
    },
    {
        'value': "hf_alpha",
        'name': "Rajshree (Female)"
    },
    {
        'value': "hf_beta",
        'name': "Priya (Female)"
    },
]

const Voice = ({ onHandleInputChange }) => {
    const [selectedVoice, setSelectedVoice] = useState(null)

    const handleVoiceSelect = (voiceValue) => {
        setSelectedVoice(voiceValue)
        onHandleInputChange('voice', voiceValue) // Assuming you want to pass the value
    }

    return (
        <div className='mt-10'>
            <h2>Video Voice</h2>
            <p className='text-sm text-gray-400 mb-1'>Select voice for video</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {VoiceOptions.map((voice) => (
                    <div
                        key={voice.value}
                        className={`cursor-pointer p-3 rounded-md transition-all duration-200 bg-gray-900 ${
                            selectedVoice === voice.value
                                ? 'bg-gray-100 ring-2 ring-gray-100 text-white'
                                : 'hover:bg-gray-900'
                        }`}
                        onClick={() => handleVoiceSelect(voice.value)}
                    >
                        <h2 className="text-center">{voice.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Voice