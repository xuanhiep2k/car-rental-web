import './car.css'
import React, {useEffect, useState} from 'react';
import axios from "axios";
import FormCar from "../../components/form/FormCar";

function Car() {
    const [cars, setCars] = useState([])
    const [car, setCar] = useState({
        "name": "",
        "licensePlate": "",
        "model": "",
        "type": "",
        "description": ""
    })
    const [totalElements, setTotalElements] = useState("");
    const [totalPages, setTotalPages] = useState("");
    const [active, setActive] = useState(1);
    const number = [];
    const [key, setKey] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [act, setAct] = useState("");

    // set number page
    for (let i = 1; i <= totalPages; i++) {
        number.push(i)
    }

    useEffect(() => {
        const config = {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            },
            params: {
                "pageNumber": 0,
                "pageSize": 5,
                "sortDirection": "ASC",
                "sortBy": "name"
            }
        };
        try {
            function fetchData() {
                axios.get("/api/car/getAllCars", config).then(res => {
                    setCars([...res.data.data.content])
                    setTotalPages(res.data.data.totalPages)
                    setTotalElements(res.data.data.totalElements)
                })
            }

            fetchData()
        } catch (error) {
            setTimeout(() => {
            }, 5000);
        }
    }, [])

    const handleClose = () => {
        setShowModal(false);
        setCar({
            "name": "",
            "licensePlate": "",
            "model": "",
            "type": "",
            "description": ""
        })
    }

    const handleShowModal = (e, car, isAct) => {
        e.preventDefault()
        setAct(isAct)
        setCar(car)
        setShowModal(true);
    }

    const paginate = async (e, i) => {
        e.preventDefault();
        setActive(i)

        const config = {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            },
            params: {
                "name": key,
                "pageNumber": i - 1,
                "pageSize": 5,
                "sortDirection": "ASC",
                "sortBy": "name"
            }
        };

        try {
            const {data} = await axios.get("/api/car/searchCarByName", config);
            setCars([...data.data.content])
            setTotalPages(data.data.totalPages)
            setTotalElements(data.data.totalElements)
        } catch (error) {
            setTimeout(() => {
            }, 5000);
        }
    }

    const handleDeleteCar = async (e, id) => {
        e.preventDefault();

        const config = {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }
        };

        try {
            await axios.delete("/api/car/deleteCar/" + id, config);
            alert("Xo?? xe th??nh c??ng")
            window.location.reload()
        } catch (error) {
            setTimeout(() => {
            }, 5000);
        }
    }

    return (
        <div className="car">

            {/*Form add and update car*/}
            <FormCar show={showModal} handleClose={handleClose} data={car} act={act}/>

            <div className="nav-table">
                <div className="text-manager">
                    <i className="bi bi-layers"></i>
                    QU???N L?? XE
                </div>
                <div className="btn-addCustomer">
                    <a href="!#" className="btn btn-brand btn-elevate"
                       onClick={(e) => handleShowModal(e, car, "add")}>
                        <i className="bi bi-plus"></i>Th??m m???i</a>
                </div>
            </div>

            {/*form search customers*/}
            <div className="form-search">
                <form onSubmit={(e) => paginate(e, 1)} className="input-group mb-3">
                    <input className="form-control mr-sm-2" type="search" placeholder="T??m theo t??n xe"
                           aria-label="Search"
                           onChange={(e) => setKey(e.target.value)} value={key}/>
                    <button className="btn btn-primary my-2 my-sm-0" type="submit">T??m ki???m</button>
                </form>
                <div className="refresh-page" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise"> C???p nh???t</i>
                </div>
            </div>

            {/*Table show list cars*/}
            <table className="table table-bordered table-hover">
                <thead>
                <tr className="table-primary">
                    <th scope="col">#</th>
                    <th scope="col">T??n xe</th>
                    <th scope="col">Bi???n s???</th>
                    <th scope="col">M???u xe</th>
                    <th scope="col">Lo???i xe</th>
                    <th scope="col">M?? t???</th>
                    <th scope="col">Ch???c n??ng</th>
                </tr>
                </thead>

                <tbody>
                {cars.length ?
                    (cars.map((car, index) => (
                        <tr key={car.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{car.name}</td>
                            <td>{car.licensePlate}</td>
                            <td>{car.model}</td>
                            <td>{car.type}</td>
                            <td>{car.description}</td>
                            <td>
                                <a href="/#" className="btn btn-primary btn-icon btn-sm" title="C???p nh???t kh??ch h??ng"
                                   onClick={(e) => handleShowModal(e, car, "update")}>
                                    <i className="bi bi-pencil-fill"></i>
                                </a>
                                <a href="/#" className="btn btn-danger btn-icon btn-sm" title="Xo?? kh??ch h??ng"
                                   onClick={(e) => handleDeleteCar(e, car.id)}>
                                    <i className="bi bi-trash-fill"></i>
                                </a>
                            </td>
                        </tr>
                    ))) :
                    (<tr className="no-search">
                        <td colSpan="7" className="text-center">
                            Kh??ng c?? xe t??m th???y
                        </td>
                    </tr>)}

                </tbody>
            </table>
            (Trang {active}/{totalPages}) (T???ng {totalElements} k???t qu???)
            {/*pagination*/}
            <div className="paging-custom">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li
                            className={"page-item" + (active === 1 ? " disabled" : "")}>
                            <a onClick={(e) => paginate(e, active - 1)}
                               className="page-link" href="/#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {number.map(i => (
                            <li key={i} onClick={(e) => paginate(e, i)}
                                className={"page-item" + (i === active ? " active" : "")}>
                                <a className="page-link" href="!#">{i}</a>
                            </li>
                        ))}
                        <li
                            className={"page-item" + (active === totalPages ? " disabled" : "")}>
                            <a onClick={(e) => paginate(e, active + 1)}
                               className="page-link" href="/!#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Car;