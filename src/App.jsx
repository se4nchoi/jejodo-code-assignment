import { useEffect, useRef, useState } from 'react'

import bannerChar from './assets/images/banner_char.svg'
import bannerPattern from './assets/images/banner_pattern.svg'
import profileImg1 from './assets/images/profile-img-1.svg'
import profileImg2 from './assets/images/profile-img-2.svg'
import profileImg3 from './assets/images/profile-img-3.svg'
import profileImg4 from './assets/images/profile-img-4.svg'
import profileImg5 from './assets/images/profile-img-5.svg'
import profileImg6 from './assets/images/profile-img-6.svg'
import userImgDefault from './assets/images/user-img-default.svg'
import searchIcon from './assets/images/search-icon.svg'
import filterIconBlack from './assets/images/filter-icon-black.svg'
import filterIconWhite from './assets/images/filter-icon-white.svg'

import SpanTextToBeHighlighted from './components/SpanTextToBeHighlighted'
import Pagination from './components/Pagination'

import styles from "./App.module.css"

const aptCategoryList = [
  ["전체", "all"],
  ["5개 이상", 5],
  ["4개", 4],
  ["3개", 3],
  ["2개", 2],
  ["1개", 1],
]

function App() {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [currList, setCurrList] = useState([])  
  const [tagList, setTagList] = useState([])  

  const [searchItemList, setSearchItemList] = useState([])

  const [query, setQuery] = useState("")
  const [highlight, setHighlight] = useState("")

  const [filterSelected, setFilterSelected] = useState(false)
  const selectedCategoryRef = useRef(null)
  const [filterValue, setFilterValue] = useState("")

  const LIMIT = 8 
  const [page, setPage] = useState(1)
  const offset = (page - 1) * LIMIT

  const fetchListData = () => {
    fetch("https://raw.githubusercontent.com/jejodo-dev-team/open-api/main/frontend.json")
    // invalid json... convert to text to manipulate
    .then((res) => res.text())
    .then(
      (text) => {
        const j = JSON.parse(text.slice(0,-3) + ']') // remove trailing comma then parse

        j.forEach( (item, i) => {
          // fetch에 avatar 이미지 추가
          switch (i+1) {
            case 1:
              item.profileImg = profileImg1;
              break;        
            case 2:
              item.profileImg = profileImg2;
              break;        
            case 3:
              item.profileImg = profileImg3;
              break;        
            case 4:
              item.profileImg = profileImg4;
              break;        
            case 5:
              item.profileImg = profileImg5;
              break;        
            case 6:
              item.profileImg = profileImg6;
              break;        
            default:
              item.profileImg = userImgDefault;
              break;
          }
        })
        
        // init lists
        setList(j)
        setCurrList(j)

        const searchParams = Object.keys(Object.assign({}, ...j)).slice(0,3)
        setTagList(j.map( user => 
          searchParams.map(param => user[param].toString().toLowerCase())
        ))
      },
      (error) => {
        console.error(error)
      }
    )
  }
  useEffect(() => {
    setLoading(true)
    fetchListData()
    setLoading(false)
  }, [])

  const search = (q) => {
    if (q.length === 0) {
      setCurrList(list)
    } else {
      setCurrList(getFilteredList(q))
    }

    setSearchItemList([])
    setHighlight(q)
    setPage(1)
  };

  const getFilteredList = (q) => {
    const searchParams = Object.keys(Object.assign({}, ...list)).slice(0,2)

    return list.filter( user => 
      searchParams.some(( 
        param => user[param].toString().toLowerCase().includes(q)
      ))
    )
  }

  const handleSearchOnChange = (e) => {
    setQuery(e.target.value)
    
    // update matching tags to searchItemList
    if (e.target.value.length > 0) {
      const regex = new RegExp(`(${e.target.value})`, "gi")
      const k = tagList.filter( (tags, i) => {
        let incl = false
        for (let j = 0; j < tags.length; j++) {
          if (regex.test(tags[j])) {
            incl = true
          }
        }
        return incl ? list[i] : incl
      })
      setSearchItemList(k)
    } else {
      setSearchItemList([])
    }
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    search(query)
  }

  const handleCategoryClick = (e) => {
    const n = e.target.dataset.num;
    setFilterValue(n)

    // remove style for curr ref
    selectedCategoryRef.current?.classList.remove(styles.selectedCategory)

    // give styling to selected
    selectedCategoryRef.current = e.target;
    e.target.classList.add(styles.selectedCategory)

    // filter the currList
    if (n === "all") {
      setCurrList(list)
    } else if (n === "5") {
      setCurrList(list.filter( user => user.building_count >= parseInt(n)))
    } else {
      setCurrList(list.filter( user => user.building_count == parseInt(n)))
    }

    setPage(1)
  }
  return (
    <>
      <header className={styles.bannerContainer}>
        <img className={styles.bannerBackground} src={bannerPattern} alt="space pattern" height={240} />
        <img className={styles.bannerChar} src={bannerChar} alt="character in space rocket" width={360} height={193.37} />
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
        <h1 className={styles.mainTitle}>화섬 아파트 지구家 입주민들</h1>
        <h3 className={styles.secondTitle}>화섬 아파트에 입주한 입주민들입니다.<br/>같이 화성에 가는날을 기다리며 화목하게 지내봐요!</h3>

        <div className={styles.searchBarWrapper}>
          <form
            className={styles.form}
            onSubmit={(e) => handleSearchSubmit(e)}
          >
            <input
              type="search"
              name="search-form"
              id="search-form"
              className={styles.searchBar}
              placeholder="검색"
              onChange={handleSearchOnChange}
            />
            <span 
              className={styles.searchIconContainer}
              onClick={(e) => handleSearchSubmit(e)}
            >
              <img 
                src={searchIcon} width={10} height={10} 
              />
            </span>
            {
            searchItemList.length > 0 && 
            <>
              <div name="search-dropdown" className={`${styles.searchDropdown}`}>
                {searchItemList.map( (item, i) => (
                  <div 
                    key={i}
                    className={styles.dropdownItem}
                    onClick={() => {
                      search(item[0])
                      setQuery(item[0])
                      setPage(1)                
                    }}
                  >
                    {item[0]}
                  </div>
                ))}
              </div>
            </>
            }
            <span className={styles.srOnly}>키워드로 검색해보세요.</span>
          </form>
        </div>

        <div className={styles.filterBarWrapper}>
          <div className={styles.filterBarTab}>
            <span>입주민들</span>
            <span className={styles.tabBlueText}>{currList.length}</span>
          </div>

          <div className={styles.filterIconContainer}
            onClick={() => {
              setFilterSelected(prev => !prev)
              setFilterValue("")
            }}
            style={{ backgroundColor: `${filterSelected ? "#000" : "#fff" }`}}
          >
            <img src={filterSelected ? filterIconWhite : filterIconBlack} width={10} height={10}/>
          </div>
        </div>
        {
          filterSelected &&
          <div className={styles.filter}>
            <span className={styles.categoryType}>보유아파트</span>
            {aptCategoryList.map( (item) => (
              <span 
                className={styles.categoryEntry}
                onClick={(e) => handleCategoryClick(e)}
                data-filter-category="apt"
                data-num={item[1]}
              >
                {item[0]}
              </span>
            ))}
          </div>
        }

        {loading ?
          <h1 className={styles.mainTitle}>로딩중...</h1>
          :
          <div className={styles.listWrapper}>
            {currList.slice(offset, offset + LIMIT).map( (user, i) => (
              <div className={styles.userWrapper} key={i}>
                <img className={styles.profileImg} src={user.profileImg} width={60} height={60}></img>
                
                <div className={styles.textContainer}>
                  <div className={styles.topLine}>
                    <SpanTextToBeHighlighted 
                      text={user.nickname}
                      highlight={highlight}
                      classNames={`${styles.nickname}`}
                    />
                    <SpanTextToBeHighlighted 
                      text={`지구家 아파트 ${user.building_count}개`}
                      highlight={highlight}
                      classNames={`${styles.buildingCount}`}
                    />
                  </div>
                  <div className={styles.botLine}>
                    <div className={`${styles.userDot} ${styles.je}`}>제</div>
                    <SpanTextToBeHighlighted 
                      text={user.nickname}
                      highlight={highlight}
                      classNames={`${styles.nickname}`}
                    />
                    <div className={`${styles.userDot} ${styles.o}`}>오</div>
                    <SpanTextToBeHighlighted 
                      text={user.oname}
                      highlight={highlight}
                    />
                  </div>
                </div>
              </div>
              )           
            )}
          </div>    
        }

        <Pagination  
          total={currList.length}
          limit={LIMIT}
          page={page}
          setPage={setPage}
        />   

        </div>
      </main>
    </>
  )
}

export default App
