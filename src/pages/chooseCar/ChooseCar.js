import './chooseCar.css'
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useLocation, useNavigate} from 'react-router-dom';
import DatePicker from "react-datepicker";

function ChooseCar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [carChecked, setCarChecked] = useState([]);

    // get data from search car
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [customer, setCustomer] = useState({});

    // get data from input to seacrh
    const [name, setName] = useState("");
    const [license, setLicense] = useState("");
    const [model, setModel] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        setCars(location.state.data.data)
        setName(location.state.name)
        setStartDate(location.state.startDate)
        setEndDate(location.state.endDate)
        setCustomer(location.state.customer)
    }, [location])

    // handle continue
    const toggleChange = () => {
        navigate("/contract", {state: {carChecked, customer, startDate, endDate}})
    }

    // handle search
    const searchHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            },
            params: {
                "name": name,
                "licensePlate": license,
                "model": model,
                "type": type,
                "startDate": startDate,
                "endDate": endDate
            }
        };

        try {
            const {data} = await axios.get("/api/car/filter", config);
            setCars(data.data)
        } catch (error) {
            setTimeout(() => {
            }, 5000);
        }
    }
    return (
        <div className="choose-car" id="contract">
            <div className="nav-table">
                <div className="text-manager">
                    <i className="bi bi-layers"></i>
                    CH???N XE ????? THU??
                </div>
                <div className="btn-addCustomer">
                    <a href="/#" className="btn btn-brand btn-elevate">
                        <i className="bi bi-plus"></i>Th??m m???i</a>
                </div>
            </div>

            <div className="form-search">
                <form onSubmit={searchHandler}>
                    <div className="input-group">
                        <div className="m-1">
                            <label htmlFor="">T??n xe</label>
                            <span className="input-group-addon">
                                <i className="bi bi-search"></i>
                            </span>
                            <input style={{"paddingLeft": "32px"}} className="form-control mr-sm-2" type="search"
                                   placeholder="T??m theo t??n xe"
                                   aria-label="Search"
                                   defaultValue={name}
                                   onChange={(e) => setName(e.target.value)}/>
                        </div>

                        <div className="m-1">
                            <label htmlFor="">Bi???n s???</label>
                            <input className="form-control mr-sm-2" type="search" placeholder="T??m theo bi???n s???"
                                   aria-label="Search"
                                   onChange={(e) => setLicense(e.target.value)}/>
                        </div>

                        <div className="m-1">
                            <label htmlFor="">M???u xe</label>
                            <input className="form-control mr-sm-2" type="search" placeholder="T??m theo m???u xe"
                                   aria-label="Search"
                                   onChange={(e) => setModel(e.target.value)}/>
                        </div>
                        <div className="m-1">
                            <label htmlFor="">Lo???i xe</label>
                            <input className="form-control mr-sm-2" type="search" placeholder="T??m theo lo???i xe"
                                   aria-label="Search"
                                   onChange={(e) => setType(e.target.value)}/>
                        </div>

                        <div className="m-1">
                            <label htmlFor="">Nh???p ng??y b???t ?????u:</label>
                            <DatePicker className="form-control mr-sm-2"
                                        selected={startDate}
                                        onChange={(date: Date) => setStartDate(date)}
                                        dateFormat="yyyy-MM-dd"/>
                        </div>

                        <div className="m-1">
                            <label htmlFor="">Nh???p ng??y k???t th??c:</label>
                            <DatePicker className="form-control mr-sm-2"
                                        selected={endDate}
                                        onChange={(date: Date) => setEndDate(date)}
                                        minDate={startDate}
                                        dateFormat="yyyy-MM-dd"/>
                        </div>
                    </div>
                    <div className="m-1">
                        <button className="btn btn-primary" type="submit">T??m ki???m</button>
                    </div>

                </form>
                <div className="nav-mix">
                    <div className="back-page" onClick={() => navigate("/searchCustomer")}>
                        <i className="bi bi-arrow-return-left"> Quay l???i
                        </i>
                    </div>
                    <div className="refresh-page" onClick={() => window.location.reload()}>
                        <i className="bi bi-arrow-clockwise"> C???p nh???t</i>
                    </div>
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
                            <td className="checkBox">
                                <input type="checkbox"
                                       onChange={(e) => {
                                           e.target.checked ?
                                               setCarChecked([...carChecked, car]) :
                                               setCarChecked(
                                                   carChecked.filter((item) => item.id !== car.id),
                                               )
                                       }}
                                       value={carChecked}/>
                            </td>
                        </tr>
                    ))) :
                    (<tr className="no-search">
                        <td colSpan="6" className="text-center">
                            Kh??ng c?? xe t??m th???y
                        </td>
                    </tr>)}

                </tbody>
            </table>
            <button className="btn-continue btn btn-primary" type="submit" onClick={toggleChange}>Ti???p t???c</button>
        </div>
    );
}

export default ChooseCar;