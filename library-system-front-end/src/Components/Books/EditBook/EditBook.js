import React, { useContext, useState, useEffect } from 'react';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { BASE_URL } from '../../../common/url';
import { Limits } from '../../../common/limits.enum';

export default function EditBook({ history, match, location }){
    const regexExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const regexExp2 = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

    const { isLoggedIn, isAdmin } = useContext(AuthContext);

    const [error, setError] = useState(null);
    
    const [book, setBook] = useState({
        coverURL:{
            value: '',
            touched: false,
            valid: false
        },
        title:{
            value: '',
            touched: false,
            valid: false
        },
        content:{
            value: '',
            touched: false,
            valid: false
        }
    })
    useEffect(() => {
        if(!(isLoggedIn && isAdmin)){
            history.push('/home')
        }else
            fetch(`${BASE_URL}/api/admin/books/${match.params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                }})
                .then(r => r.json())
                .then(result => {
                    if (!result.id || !result.title || !result.content) {
                        setError("Couldn't get book, it doesnt exist");
                    }else{
                        setBook({
                            coverURL:{
                                value: result.coverURL,
                                touched: false,
                                valid: bookValidators['coverURL'].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(result.coverURL) !== 'string'), true)
                            },
                            title:{
                                value: result.title,
                                touched: false,
                                valid: bookValidators['title'].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(result.title) !== 'string'), true)
                            },
                            content:{
                                value: result.content,
                                touched: false,
                                valid: bookValidators['content'].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(result.content) !== 'string'), true)
                            }
                        })
                    }
                })
    }, [history, isLoggedIn, isAdmin, setBook, setError])

    const bookValidators = {
        coverURL: [
          value => (value?.match(regexExp) || value?.match(regexExp2) ) || `The cover URL is not a valid URL`, 
        ],
        title: [
          value => value?.length >= Limits.MIN_BOOK_TITLE_LENGTH || `Title should be at least ${Limits.MIN_BOOK_TITLE_LENGTH} letters.`,
          value => value?.length <= Limits.MAX_BOOK_TITLE_LENGTH || `Title should be no more than ${Limits.MAX_BOOK_TITLE_LENGTH} letters.`,
        ],
        content: [
            value => value?.length >= Limits.MIN_BOOK_CONTENT_LENGTH || `Content should be at least ${Limits.MIN_BOOK_CONTENT_LENGTH} letters.`,
            value => value?.length <= Limits.MAX_BOOK_CONTENT_LENGTH || `Content should be no more than ${Limits.MAX_BOOK_CONTENT_LENGTH} letters.`, 
        ],
      };

    const updateBook = (prop, value) => setBook({
        ...book,
        [prop]: {
          value,
          touched: true,
          valid: bookValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
        }
      })

      const getValidationErrors = (prop) => {
        return bookValidators[prop]
          .map(validatorFn => validatorFn(book[prop].value)) 
          .filter(value => typeof value === 'string');
      };
    

    const validateForm = () => !Object
    .keys(book)
    .reduce((isValid, prop) => isValid && book[prop].valid, true);


    const getClassNames = (prop) => {
        let classes = '';
        if (book[prop].touched) {
        classes += 'touched '
        }
        if (book[prop].valid) {
        classes += 'is-valid ';
        } else {
        classes += 'is-invalid ';
        }
    
        return classes;
    };

    const changeBook = (e) => {
        e.preventDefault();
        setError(null);
        fetch(`${BASE_URL}/api/admin/books/${match.params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            coverURL: book.coverURL.value,
            title: book.title.value,
            content: book.content.value,
        }),
        })
        .then(r => r.json())
        .then(result => {
            if (!result.id || !result.title || !result.content) {
                setError("Couldn't create book, something happened");
            }else{
                history.push('/allbooks');
            }
        })
    }


    return (
        <div className={"container create-book-container"}>
        <div className={"row"}>
            <div className={"col-md-6 create-book-form-1"}>
                <h3>Create Book</h3>
                <div className={`form-group`}>
                    <input type="text" required={true} className={`form-control ${getClassNames('coverURL')}`} placeholder="Book cover URL *" value={book.coverURL.value} onChange={e => updateBook('coverURL', e.target.value)} />
                </div>
                <div className={`form-group`}>
                    <input type="text" required={true} className={`form-control  ${getClassNames('title')}`} placeholder="Your Book Title *" value={book.title.value} onChange={e => updateBook('title', e.target.value)} />
                </div>
                <div className={`form-group`}>
                    <textarea className={`form-control ${getClassNames('content')}`} required={true} placeholder='Your Book Contents *' value={book.content.value} onChange={e => updateBook('content', e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <input type="submit" className="btnSubmit" disabled = {validateForm()} value="Edit the book" onClick={changeBook} />
                </div>
            </div>
        </div>
        <div className="alert alert-danger" hidden={!validateForm()} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
            {Object.keys(book).map(key => getValidationErrors(key)).join('\n')}
            {error}
        </div>
    </div>
    )
}