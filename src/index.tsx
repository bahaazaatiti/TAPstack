import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import BlockManager from './components/BlockManager'

// Initialize block manager to handle all React blocks
const blockContainer = document.createElement('div')
blockContainer.style.display = 'none'
document.body.appendChild(blockContainer)

const root = createRoot(blockContainer)
root.render(<BlockManager />)

console.log('Kirby React Blocks System Ready!')
