"use client"

import React, { useEffect, useState } from 'react'
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
  } from '@chakra-ui/react'
  import { CheckIcon, ArrowDownIcon, DragHandleIcon } from '@chakra-ui/icons'
const InteractionData = () => {
    type InteractionPayload = {
        tabUrl: string;
        elementXPath?: string;
        action: string;
        enteredText?: string;
        scrollValue?: number;
        // Add any other properties if needed
    };
    
    type InteractionData = {
        [tabId: number]: InteractionPayload[];
    };
    // let interactionData: InteractionData = {};
    const [interactionData, setInteractionData] = useState<InteractionData>({});
    const test= {
        5:[
            { tabUrl: 'https://react.dev/', elementXPath: '@id="__next"/div[3]/nav[1]/div[1]/div[3]/div[3]/div[3]/button[1]/svg[1]', action: 'click' },
            { tabUrl: 'https://react.dev/', elementXPath: '@id="__next"/div[3]/nav[1]/div[1]/div[3]/div[3]/div[2]/button[1]/svg[1]', action: 'click' },
            { tabUrl: 'https://react.dev/', elementXPath: '@id="__next"/div[3]/nav[1]/div[1]/div[2]/button[1]', action: 'click' },
            { tabUrl: 'https://react.dev/', enteredText: 'indsianb', action: 'input' },
            { tabUrl: 'https://react.dev/', elementXPath: '/div[1]/div[1]/header[1]/button[1]', action: 'click' },
            { tabUrl: 'https://react.dev/', scrollValue: 3023, action: 'scroll' }
          ]
    }
    // console.log(Object.keys(test).length,"antoher",Object.keys(test)[0],test[Object.keys(test)[0]] )
    
    useEffect(() => {
        // Event listener for messages from content script
        //once listener laga diye until component hatega nahi tab tak rahega yeh listener
        window.addEventListener('message', handleMessageFromContentScript);
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('message', handleMessageFromContentScript);
        };
    }, []);
    
    function handleMessageFromContentScript(event: MessageEvent) {
        if(event.data && event.data.tabId){
            let request = event.data;
        // if (!interactionData[request.tabId]) {
        //     interactionData[request.tabId] = [];
        // }
        // interactionData[request.tabId].push(request.payload);
        // console.log(interactionData);
        setInteractionData((prevData)=>{
            if(!prevData[request.tabId]){
                prevData[request.tabId]=[]
            }
            prevData[request.tabId].push(request.payload);
            console.log(prevData,"cec");
            return prevData;
        })    
        console.log(interactionData)
        // if(Object.keys(interactionData).length > 0){
        //     console.log("object first chcek",Object.keys(interactionData)[0]);
        // }
        }
        
    }

  return (
    // <div>
    //     {
    //         test[Object.keys(test)[0]].map((data:InteractionPayload)=>(
    //             <div> {data.tabUrl} </div>
    //         )
                
    //         )
    //     }
    // </div>
    <List spacing={3}>

        {interactionData && Object.keys(interactionData).length > 0
        && interactionData[Object.keys(interactionData)[0]].map((data: InteractionPayload) => (
        <ListItem >
          {data.action === 'click' && (
                <div>
                <ListIcon as={CheckIcon} color='green.500' />
                Clicked on Element {data.elementXPath} 
                </div>
            )}
            {data.action === 'input' && (
                <div>
                <ListIcon as={DragHandleIcon} color='green.500' />
                Entered Input {data.enteredText}
                </div>
            )}
            {data.action === 'scroll' && (
              <div>
              <ListIcon as={ArrowDownIcon} color='green.500' />
              Scroll to coordinate {data.scrollValue}
              </div>
            )}
        </ListItem>
      ))
    }
    </List>
  )
}

export default InteractionData
