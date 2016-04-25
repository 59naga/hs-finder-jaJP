import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import {Tooltip} from 'react-mdl'

import './index.styl'

const getPlayerClass= (name)=>{
  if(name===undefined){
    return ''
  }

  switch(name){
    case 'Warlock':
      return 'Wl'

    default:
      return name.slice(0,2)
  }
}

class Greet extends React.Component{
  componentDidMount(){
    axios('https://api.hearthstonejson.com/v1/latest/all/cards.collectible.json')
    .then(response => {
      this.setState({data: response.data})
    })
  }
  render(){
    const data = (this.state && this.state.data || [])
    const cards = _.chain(data)
      .filter('flavor')
      .filter('collectible')
      .filter(card => card.id.slice(0, 3) === 'OG_')
      .sortBy('name')
      .sortBy('cost')
      .value()

    return (
      <div>
        <div id="hs">
          <table>
            <caption>
              {cards.length}
              件あるぞ
            </caption>
            <thead>
              <tr>
                <td className="mark"></td>
                <th style={{minWidth:'16em'}}>カード名（日／英）</th>
                <td className="num">C</td>
                <td className="num">A</td>
                <td className="num">H</td>
                <td className="description">説明</td>
              </tr>
            </thead>
            <tbody>
              {
                cards.map(card => {
                  const url= 'http://hearthstonemaniac.com/index.php?'+encodeURIComponent(card.name.jaJP+'/'+card.name.enUS)
                  const original = `http://wow.zamimg.com/images/hearthstone/cards/enus/original/${card.id}.png`;
                  const animatedGif = `http://wow.zamimg.com/images/hearthstone/cards/enus/animated/${card.id}_premium.gif`;
                  const text = (card.text || {}).jaJP || '';
                  const normalizedText = text.replace(/\n/g,'').replace(/\$(\d+)/g,'<b>$1</b>').replace(/\#(\d+)/g,'<b>$1</b>')

                  return (
                    <tr key={card.id}>
                      <td className="mark">{getPlayerClass(card.playerClass)}</td>
                      <th>
                        <Tooltip label={
                          <div>
                            <img src={original} alt=""/>
                          </div>
                        }>
                          <a href={url} target="_blank">
                            <figure><img src={original}/></figure>
                            <h2>{card.name.jaJP}</h2>
                            <aside>{card.name.enUS}</aside>
                          </a>
                        </Tooltip>
                      </th>
                      <td className="num">{card.cost}</td>
                      <td className="num">{card.attack}</td>
                      <td className="num">{card.health || card.durability}</td>
                      <td className="description" dangerouslySetInnerHTML={{__html: normalizedText}}></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

window.addEventListener('DOMContentLoaded',()=>{
  ReactDOM.render (<Greet />,document.querySelector('main'))
});
