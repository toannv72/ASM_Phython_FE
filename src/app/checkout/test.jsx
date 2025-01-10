import React from 'react'

export default function test() {

    const [data, setData] = useState([{ id: 1, name: "toàn" }, { id: 2, name: "toàn2" }])
    
    const List = () => {
        for (let i = 0; i < data.length; i++) {
            return (
                <div key={data[i].id}>{data[i].name}</div>
            )
        }
    }

  return (
    <div>test</div>
  )
}
