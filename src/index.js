/*
# TODO
- リファクタリング（重複コードがすごく多い）
- テスト（バグの巣窟）
*/

import React from 'react'
import ReactDOM from 'react-dom'
import {Tooltip} from 'react-mdl'

import xhr from 'xhr'
import {Zlib} from 'zlibjs/bin/unzip.min'
import _ from 'lodash'

require('./index.styl')
const url= 'https://hearthstonejson.com/json/AllSetsAllLanguages.json.zip'
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

class Form extends React.Component{
  constructor(){
    super()

    this.state= {}
  }
  handleReset(event){
    this.setState({
      words: null,
      cost: null,
      player: null,
      type: null,
      rarity: null,
    })

    this.refs.list.find()
  }

  getConditions(){
    return JSON.parse(JSON.stringify(this.state))
  }
  handleSubmit(event){
    event.preventDefault()

    this.refs.list.find(this.getConditions())
  }
  handleChange(event){
    const words= event.target.value

    this.setState({words})
  }
  handleChangeCost(event){
    const conditions= this.getConditions()

    let cost= Number(event.target.value)
    if(this.state.cost===cost){
      cost= null
    }
    this.setState({cost:cost})

    conditions.cost= cost
    this.refs.list.find(conditions)
  }
  handleChangePlayer(event){
    const conditions= this.getConditions()

    let player= event.target.value
    if(this.state.player===player){
      player= null
    }
    this.setState({player:player})

    conditions.player= player
    this.refs.list.find(conditions)
  }
  handleChangeType(event){
    const conditions= this.getConditions()

    let type= event.target.value
    if(this.state.type===type){
      type= null
    }
    this.setState({type:type})

    conditions.type= type
    this.refs.list.find(conditions)
  }
  handleChangeRarity(event){
    const conditions= this.getConditions()

    let rarity= event.target.value
    if(this.state.rarity===rarity){
      rarity= null
    }
    this.setState({rarity:rarity})

    conditions.rarity= rarity
    this.refs.list.find(conditions)
  }

  render(){
    const types= [
      'Minion',
      'Spell',
      'Weapon',
    ].map((type)=>{
      return (
        <label key={'type'+type}>
          <input
            type="checkbox"
            name="type"
            value={type}
            checked={this.state.type===type}
            onChange={::this.handleChangeType}
          />
          {type}
        </label>
      )
    })

    const rarities= [
      'Free',
      'Common',
      'Rare',
      'Epic',
      'Legendary',
    ].map((rarity)=>{
      return (
        <label key={'rarity'+rarity}>
          <input
            type="checkbox"
            name="rarity"
            value={rarity}
            checked={this.state.rarity===rarity}
            onChange={::this.handleChangeRarity}
          />
          {rarity}
        </label>
      )
    })

    const classes= [
      'Druid',
      'Hunter',
      'Mage',
      'Paladin',
      'Priest',
      'Rogue',
      'Shaman',
      'Warlock',
      'Warrior',
      'Neutral',
    ].map((player)=>{
      return (
        <label key={'player'+player}>
          <input
            type="checkbox"
            name="player"
            value={player}
            checked={this.state.player===player}
            onChange={::this.handleChangePlayer}
          />
          {player}
        </label>
      )
    })

    const costs= []
    for(let i=0; i<=7; i++){
      let text= i===7? '7以上': i;

      costs.push(
        <label key={'cost'+i}>
          <input
            type="checkbox"
            name="cost"
            value={i}
            checked={this.state.cost===i}
            onChange={::this.handleChangeCost}
          />
          {text}
        </label>
      )
    }

    return (
      <div>
        <div id="hs">
          <form onSubmit={::this.handleSubmit}>
            <input
              ref='words'
              autoFocus
              value={this.state.words}
              onChange={::this.handleChange}

              placeholder="カード名（日／英）説明で検索できるぞ"
            />
            <div className="rarities">{rarities}</div>
            <div className="types">{types}</div>
            <div className="classes">{classes}</div>
            <div className="costs">{costs}</div>
            <footer>
              <button>検索</button>
              <button type="reset" onClick={::this.handleReset}>リセット</button>
            </footer>
          </form>
          <footer>
            <List ref="list" />
          </footer>
        </div>
      </div>
    )
  }
}
class List extends React.Component{
  constructor(){
    super()

    const options= {
      responseType: 'arraybuffer'
    }

    this.state= {}

    xhr.get(url,options,(error,response)=>{
      if(error){
        throw error
      }

      const unzip= new Zlib.Unzip(new Buffer(response.body))
      const filenames= unzip.getFilenames()
      const buffer= new Buffer(unzip.decompress(filenames[0]),'utf8')
      const languages= JSON.parse(buffer.toString())

      this.setState({languages})
      this.find()
    })
  }
  find({words,cost,player,type,rarity}={}){
    const language= 'jaJP'
    const areas= this.state.languages[language]

    let cards= []
    let enCards= []
    for(let area in areas){
      cards= cards.concat(areas[area])
      enCards= enCards.concat(this.state.languages.enUS[area])
    }

    const found= _
      .chain(cards)
      .filter('flavor')
      .filter('collectible')
      .filter((card)=>{
        let isChosenType= true
        if(type!=null){
          isChosenType= card.type===type
        }
        if(!isChosenType){
          return false
        }

        let isChosenRarity= true
        if(rarity!=null){
          isChosenRarity= card.rarity===rarity
        }
        if(!isChosenRarity){
          return false
        }

        let isChosenPlayer= true
        if(player!=null){
          isChosenPlayer= player==='Neutral'? card.playerClass===undefined: card.playerClass===player
        }
        if(!isChosenPlayer){
          return false
        }

        let isChosenCost= true
        if(cost!=null){
          isChosenCost= cost===7? card.cost>=cost: card.cost===cost
        }
        if(!isChosenCost){
          return false
        }

        if((words || '').length===0){
          return isChosenCost && isChosenPlayer
        }
        
        const regexp= new RegExp(words,'i')
        const enCard= _.find(enCards,'id',card.id)
        const matched= card.name.match(regexp) || enCard.name.match(regexp) || (card.text || '').match(regexp)

        return matched
      })
      .sortBy('name')
      .sortBy('cost')
      .map((card)=>{
        const enCard= _.find(enCards,'id',card.id)

        const url= 'http://hearthstonemaniac.com/index.php?'+encodeURIComponent(card.name+'/'+enCard.name)
        const thumbnail= 'http://wow.zamimg.com/images/hearthstone/cards/enus/original/'+card.id+'.png'
        const description= {
          __html: card.text? card.text.replace(/\n/g,'').replace(/\$(\d+)/g,'<b>$1</b>').replace(/\#(\d+)/g,'<b>$1</b>'): ''
        }

        return (
          <tr key={card.id}>
            <td className="mark">{getPlayerClass(card.playerClass)}</td>
            <th>
              <Tooltip label={
                <div>
                  <img src={thumbnail} alt=""/>
                </div>
              }>
                <a href={url} target="_blank">
                  <figure><img src={thumbnail}/></figure>
                  <h2>{card.name}</h2>
                  <aside>{enCard.name}</aside>
                </a>
              </Tooltip>
            </th>
            <td className="num">{card.cost}</td>
            <td className="num">{card.attack}</td>
            <td className="num">{card.health}</td>
            <td className="description" dangerouslySetInnerHTML={description}></td>
          </tr>
        )
      })
      .value()
      ;

    this.setState({found})
  }
  render(){
    if(this.state.found){
      if(this.state.found.length===0){
        return <div className="notify">ないよ</div>
      }

      return (
        <table>
          <caption>
            {this.state.found.length}
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
          <tbody>{this.state.found}</tbody>
        </table>
      )
    }

    return <div className="notify">データベースを読込中…</div>
  }
}

if(typeof window!=='undefined'){
  window.addEventListener('load',()=>{
    ReactDOM.render(<Form />,document.querySelector('main'))
  })
}