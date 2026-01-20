import topo from './../../image/image-map/topo_map.png'
import hybrid from './../../image/image-map/hybrid_map.png'
import streets from './../../image/image-map/streets_map.png'
import oceans from './../../image/image-map/oceans_map.png'
import dark from './../../image/image-map/dark_map.png'
const initialState = [
  {
    active: false,
    name_type: 'Default Map',
    type: 'osm-streets-relief',
    image: topo
  },
  {
    active: false,
    name_type: 'Hybrid',
    type: 'hybrid',
    image: hybrid
  },
  {
    active: false,
    name_type: 'Streets',
    type: 'streets-vector',
    image: streets
  },
  {
    active: false,
    name_type: 'OSM Standard',
    type: 'osm-standard',
    image: oceans
  },
  {
    active: false,
    name_type: 'OSM Dark',
    type: 'osm-dark-gray',
    image: dark
  }
]

const TypeMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGER_TYPE_MAP': {
      return {
        ...state,
        typeMapList: action
      }
    }

    default: {
      return state
    }
  }
}
export default TypeMapReducer
