import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DiscoverItem from './DiscoverItem';
import '../styles/_discover-block.scss';
import Discover from "../../Discover";


export default class DiscoverBlock  extends Component {
    value = 0
    constructor(props) {
        super(props);
        this.scrollContainer = this.scrollContainer.bind(this)


    }

    scrollContainer(id, { isNegative } = {}) {
            const scrollableContainer = document.getElementById(id);
            const amount = isNegative ? -scrollableContainer.offsetWidth : scrollableContainer.offsetWidth;

            scrollableContainer.scrollLeft = scrollableContainer.scrollLeft + amount;

            //Do a little comparison here

            if(scrollableContainer.scrollLeft + amount >= scrollableContainer.scrollWidth ){
                           this.props.plusOffset()
                }
                else if(scrollableContainer.scrollLeft + amount <= 0){
                            this.props.minusOffset()

                }



    };



    render() {
        return (
            <div className="discover-block">
                <div className="discover-block__header">
                    <h2>{this.props.text}</h2>
                    <span/>
                    {
                        this.props.data.length ? (
                            <div className="animate__animated animate__fadeIn">
                                <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    onClick={ () =>{
                                        //this.props.minusOffset();
                                        return this.scrollContainer(this.props.id, {isNegative: true})
                                    }
                                    }
                                    //On click, will reduce the offset
                                />
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    onClick={
                                        () =>{
                                            return this.scrollContainer(this.props.id)
                                        }
                                    }

                                         //return this.scrollContainer(this.props.id);}

                                    //On click, will increase the offset
                                />
                            </div>
                        ) : null
                    }
                </div>
                <div className="discover-block__row" id={this.props.id}>
                    {this.props.data.map(({[this.props.imagesKey]: images, name}) => (
                        <DiscoverItem key={name} images={images} name={name}/>
                    ))}
                </div>
            </div>
        );
    }
}
