import React from 'react'
import { Table } from 'reactstrap'
import '../assets/styles/MySongs.css'

export default function MySongs() {
  return (
    <div className='mysongs'>
      <div className='mysongs-top'>
        <h2 className='mysongs-title'>
          My Songs
        </h2>
        <div className='mysongs-upload-btn-wrapper'>
          <button className='mysongs-upload-btn'>
            + Add New Song
          </button>
        </div>
      </div>
      <div className='mysongs-bottom'>
        <Table bordered={true} className='mysongs-table'>
          <thead>
            <tr>
              <th>Song Name</th>
              <th>Upload Date</th>
            </tr>
          </thead>
        </Table>
      </div>
    </div>
  )
}
