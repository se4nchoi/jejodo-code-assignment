import React from 'react'
import styles from './Pagination.module.css'

import ArrowR from '../assets/images/pagination-single-arrow-right.svg'
import ArrowL from '../assets/images/pagination-single-arrow-left.svg'
import DoubleArrowR from '../assets/images/pagination-double-arrow-right.svg'
import DoubleArrowL from '../assets/images/pagination-double-arrow-left.svg'

const Pagination = ({ total, limit, page, setPage }) => {
  const numPages = Math.ceil(total / limit)
  
  return (
    <div className={styles.wrapper}>
      <button 
        className={styles.btnContainer} 
        onClick={() => setPage(1)}
        disabled={page === 1}
      >
        <img src={DoubleArrowL} alt="pagination arrow" />
      </button>
      <button 
        className={`${styles.btnContainer} ${styles.singleL}`} 
        onClick={() => setPage(prev => prev - 1)}
        disabled={page === 1}
      >
        <img src={ArrowL} alt="pagination arrow" />
      </button>
      {
        Array(numPages)
        .fill()
        .map( (x, i) => (
          <button
            className={`${styles.pageNumberBtn} ${i+1 === page ? styles.currentPage : ""}`}
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : null}
          >
            {i + 1}
          </button>
        ))
      }
      <button 
        className={`${styles.btnContainer} ${styles.single}`} 
        onClick={() => setPage(prev => prev + 1)}
        disabled={page === numPages}
      >
        <img src={ArrowR} alt="pagination arrow" />
      </button>
      <button 
        className={styles.btnContainer} 
        onClick={() => setPage(numPages)}
        disabled={page === numPages}
      >
        <img src={DoubleArrowR} alt="pagination arrow" />
      </button>
      
    </div>
  )
}

export default Pagination