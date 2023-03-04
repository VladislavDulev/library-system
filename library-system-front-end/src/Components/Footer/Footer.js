import React from "react";
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

export default function FooterPage() {
  return (
    <footer className='footer mt-auto py-3 bg-dark text-white'>
      <div className='container'>
      <ul style={{listStyleType: "none"}}>
         <li>
             <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
             <a href="https://www.facebook.com/vladislav.dulev" style={{color:'white', textDecoration:'none'}}>Vladi</a>
         </li>
         <li>
             <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
             <a href="https://www.facebook.com/hypnotizedstefan" style={{color:'white', textDecoration:'none'}}>Stefan</a>
         </li>
       </ul>
      </div>
    </footer>
  )
}
