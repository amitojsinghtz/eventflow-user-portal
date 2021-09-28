import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from "mobx-react";
import { autorun, toJS } from 'mobx';

import { Typography, Container, makeStyles, Grid, Link, Button, Box } from '@material-ui/core';
import { Link as RLink, useParams } from 'react-router-dom';
import queryString, { parse } from 'query-string';
import clsx from 'clsx';
import { useAuth0 } from '@auth0/auth0-react';
import { isEmpty, setFormParams } from "../../utils/Utils";
import { SystemProvider } from '../../utils/SystemContext';
import { Loading, Steps } from '../../components';
import CustomFieldTemplate from '../../ui-component/CustomFieldTemplate';
import { CustomTypography, CustomList, Break, S3Uploader } from '../../ui-component/CustomElements';
import Form from "@rjsf/material-ui";
import {regionalCodes } from '../../assets/json/regionalCodes';
import {companyTypes} from '../../assets/json/companyTypes';


/**************** TEST  ***************/

const testSchema ={
  "title": "Test Submission",
  "type": "object",
  "properties": {
    "confirmEnter": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["confirm_category_enter"],
        "enumNames": ["I confirm that this is the category I would like to enter for"]
      },
      "uniqueItems": true
    },
    "creditedAgency": {
      "type": "string",
      "title": "Credited Agency"
    },
    "submissionTwo": {
      "type": "string",
      "format": "data-url",
      "description": "Upload Image File *"
    }
  }
};
const testUiSchema = {};

/************** Step 1 ***************/


/*Note: For using custom component as widgets, you have to make sure that they are in a string form when inserting them inside Admin end. 

Example: { description: { 'ui:widget': CustomTypography, variant: 'subtitle2' } } should be inserted as --> { description: { 'ui:widget': 'CustomTypography', variant: 'subtitle2' } }

For using JSON data inside the Schema, it must have two things customProp, i.e. the name of the JSON data you want to use. Second, it must also have customPropType, this will let me know where this data must be inserted inside the object.

Example 1: phonePrefix:{...regionalCodes, "title":"Mobile Phone Prefix"} should be inserted as -->  phonePrefix: { customProp: 'regionalCodes', customPropType: 'flat', title: 'Phone Prefix', }

Example 2: typeOfCompany :{ "title":"Type of Company", "type":"string", "enum":[...companyTypes] } should be inserted as --> typeOfCompany: { title: 'Type of Company', type: 'string', customProp: 'companyTypes', customPropType: 'enum', },

*/

const schema = {
  "type": "object",
  "required": [
    "firstName",
    "lastName",
    "company",
    "workemail",
    "jobTitle",
    "phone",
    "mobilePhone",
    "address1",
    "address2",
    "typeOfCompany",
    "terms"
  ],
  "properties": {
    "aliasCode":{
      "type": "string",
    },
    "firstContactTitle":{
      "type":"string",
      "title":"Entrant's Contact Details"
    },
    "firstContactCaption":{
      "type":"string",
      "title":"Please enter all the fields marked with the asterisk (*).\nThe entrant’s contact information provided below should be of the primary contact person for all awards-related matters including entry eligibility, submission checks, jury queries (if any), and results."
    },
    "firstName": {
      "type": "string",
      "title": "First name"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "company": {
      "type": "string",
      "title": "Company",
      "format":"company"
    },
    "jobTitle": {
      "type": "string",
      "title": "Job Title"
    },
    "workemail": {
      "type": "string",
      "title": "Work Email",
      "format":"email"
    },
    "address1": {
      "type": "string",
      "title": "Address Line 1"
    },
    "address2": {
      "type": "string",
      "title": "Address Line 2"
    },
    'phonePrefix':{...regionalCodes, "title":"Phone Prefix", customProp: 'regionalCodes', customPropType: 'obj'},
    "phone": {
      "type": "number",
      "title": "Phone",
      "maximum": 1000000000
    },
    'mobilePhonePrefix':{...regionalCodes, "title":"Mobile Phone Prefix"},
    "mobilePhone": {
      "type": "number",
      "title": "Mobile Phone",
      "maximum": 1000000000
    },
    "city": {
      "type": "string",
      "title": "City"
    },
    "state": {
      "type": "string",
      "title": "State"
    },
    "zipcode": {
      "type": "string",
      "title": "Zip Code"
    },
    "country": {
      "type": "string",
      "title": "Country",
      "enum": ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]
    },
    "typeOfCompanyTitle":{
      "title":"Type of Company",
      "type": "string"
    },
    "typeOfCompany":{
      "title":"Type of Company",
      "type":"string",
      "enum":[...companyTypes]
    },
    "otherCompany":{
      "title":"Other type of company",
      "type": "string"
    },
    "howKnowAoyTitle":{
      "title":"How did you hear about the entry of AOY is open?",
      "type": "string"
    },
    "howKnowAoy":{
      "title":"How did you hear about the entry of AOY is open?",
      "type":"string",
      "enum":[...companyTypes]
    },
    "otherHowToKnowAOY":{
      "title":"Other",
      "type": "string"
    },
    "reciveNewsOffers":{
      "type":"array",
      "title":"Do you wish to receive timely news and offers from us, via email to your specified address?",
      "items":{
        "type":"string",
        "enum": [
          "latest_product_services",
          "third_parties"
        ],
        "enumNames": [
          "I wish to receive latest promotional products and services",
          "I wish to receive promotions offered by carefully screened third parties"
        ]
      },
      "uniqueItems": true
    },
    "termsTitle":{
      "type":"string",
      "title":"With your consent we will use the contact data you have given us to send you marketing messages about our products & services. We will work with our business partners who will send you marketing messages that we have selected (because we think you’ll find them of interest) including but not limited to, Business Solutions, Education & Training, Events, Finance & Investment, Media & Marketing, Subscriptions, Surveys & Research, Consumer Electronics, Automotive, Sport, and Travel & Leisure. You will always be able to unsubscribe or opt out of receiving marketing messages at any time. These business arrangements help us to save you money and allow us to provide some of our services for free."
    },
    "terms":{
      "type": "boolean",
      "title":"By checking this box, you agree to our End User Terms & Privacy Policy."
    },
    "breakOne":{
      "type": "string"
    },
    "secondaryContactTitle":{
      "title":"Secondary Contact Details",
      "type":"string"
    },
    "secondaryContactCaption":{
      "title":"The secondary contact information provided below will be notified or in touch for all awards-related matters including entry eligibility, submission checks, jury queries (if any), and results. Secondary contact must be different to primary contact.",
      "type":"string"
    },
    "secondFirstName": {
      "type": "string",
      "title": "Secondary Contact's First Name"
    },
    "secondLastName": {
      "type": "string",
      "title": "Secondary Contact's Last Name"
    },
    "secondCompany": {
      "type": "string",
      "title": "Secondary Contact's Company",
      "format":"company"
    },
    "secondJobTitle": {
      "type": "string",
      "title": "Secondary Contact's Job Title"
    },
    "secondWorkemail": {
      "type": "string",
      "title": "Secondary Contact's Work Email",
      "format":"email"
    },
    'secondPhonePrefix':{...regionalCodes, "title":"Phone Prefix"},
    "secondPhone": {
      "type": "number",
      "title": "Secondary Contact's Number",
      "maximum": 1000000000
    },
    "secondReciveNewsOffers":{
      "type":"array",
      "title":"Do you wish to receive timely news and offers from us, via email to your specified address?",
      "items":{
        "type":"string",
        "enum": [
          "latest_product_services",
          "third_parties"
        ],
        "enumNames": [
          "I wish to receive latest promotional products and services",
          "I wish to receive promotions offered by carefully screened third parties"
        ]
      },
      "uniqueItems": true
    },
    "secondTermsTitle":{
      "type":"string",
      "title":"With your consent we will use the contact data you have given us to send you marketing messages about our products & services. We will work with our business partners who will send you marketing messages that we have selected (because we think you’ll find them of interest) including but not limited to, Business Solutions, Education & Training, Events, Finance & Investment, Media & Marketing, Subscriptions, Surveys & Research, Consumer Electronics, Automotive, Sport, and Travel & Leisure. You will always be able to unsubscribe or opt out of receiving marketing messages at any time. These business arrangements help us to save you money and allow us to provide some of our services for free."
    },
    "secondTerms":{
      "type": "boolean",
      "title":"By checking this box, you agree to our End User Terms & Privacy Policy."
    },
  }
};



const uiSchema = {
  "description":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "firstContactTitle":{"ui:widget":CustomTypography,"variant":'h3'},
  "firstContactCaption":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "firstName": {'xs':12, 'md':6},
  "lastName": {'xs':12, 'md':6},
  "city":{'xs':12, 'md':6},
  "state":{'xs':12, 'md':6},
  "zipcode":{'xs':12, 'md':6},
  "country":{'xs':12, 'md':6},
  "phonePrefix":{'xs':5, 'md':5},
  "phone":{'xs':7,'md':7},
  "mobilePhonePrefix":{'xs':5, 'md':5},
  "mobilePhone":{'xs':7, 'md':7},
  "typeOfCompanyTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "howKnowAoyTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "reciveNewsOffers":{"ui:widget": "checkboxes"},
  "termsTitle":{"ui:widget":CustomTypography,"variant":'body1'},
  "aliasCode":{"ui:widget":"hidden"},
  "breakOne":{"ui:widget":Break},
  
  "secondaryContactTitle":{"ui:widget":CustomTypography,"variant":'h3'},
  "secondaryContactCaption":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "secondFirstName": {'xs':12, 'md':6},
  "secondLastName": {'xs':12, 'md':6},
  "secondPhonePrefix":{'xs':5, 'md':5},
  "secondPhone":{'xs':7,'md':7},
  "secondReciveNewsOffers":{"ui:widget": "checkboxes"},
  "secondTermsTitle":{"ui:widget":CustomTypography,"variant":'body1'},
};

const formData = {
  "terms":true
}

/************** Step 2 ***************/

const schemaSelect = {
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "api":{
    "regions":"DropDownList/GetRegion?awardAliasCode=AOY2021",
    "categories":"DropDownList/GetCategoryTypeByRegion?awardAliasCode=AOY2021&region=SEA"
  },
  "properties": {
    "Regions": {
      "type": "string",
      "enum": [
        "SA",
        "SEA",
        "ANZ",
        "JPKR",
        "APAC"
      ],
      "enumNames": [
        "South Asia",
        "South East Asia",
        "Australia / New Zealand",
        "Japan / Korea",
        "Asia Pacific"
      ],
      "default": "SA"
    }
  },
  "required": [
    "Regions"
  ],
  "dependencies": {
    "Regions": {
      "oneOf": [
        {
          "properties": {
            "Regions": {
              "enum":[
                "SA"
              ],
            },
            "CategoryTypes":{
              "enum":[
                "AG",
                "PP",
                "BD"
              ],
              "enumNames": [
                "Agency Category",
                "People Category",
                "Brand Category"
              ]
            }
          },
          "dependencies": {
            "CategoryTypes":{
              "oneOf":[
                {
                  "properties": {
                    "CategoryTypes": {
                      "enum":[
                        "AG"
                      ],
                    },
                    "Categories":{
                      "enum":[
                        "SA01.",
                        "SA02.",
                        "SA03."
                      ],
                      "enumNames": [
                        "India Creative Agency of the Year",
                        "Pakistan Creative Agency of the Year",
                        "Rest of South Asia Creative Agency of the Year"
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "CategoryTypes": {
                      "enum":[
                        "PP"
                      ],
                    },
                    "Categories":{
                      "enum":[
                        "SA28.",
                        "SA29.",
                        "SA30."
                      ],
                      "enumNames": [
                        "South Asia Account Person of the Year",
                        "South Asia Agency Head of the Year",
                        "South Asia Channel/Engagement Planner of the Year"
                      ]
                    }

                  }
                }
              ]
            }
          }
        },
        {
          "properties": {
            "Regions": {
              "enum":[
                "SEA"
              ]
            },
            "Category":{
              "enum":[
                "AG",
                "PP",
                "BD"
              ],
              "enumNames": [
                "Agency Category",
                "People Category",
                "Brand Category"
              ]
            }
          }
        }
      ]
    }
  }
};

/************** Step 3 ***************/
//https://github.com/TreeHacks/root/blob/9f21f350416493e1f90fed5102330f4c8f8f1d0c/src/FormPage/FormPage.tsx#L27-L52
const schemaEntry = {
  "title": "Entry Submission",
  "type": "object",
  "required": [
    "confirmEnter",
    "creditedNominee",
    "creditedAgency",
    "creditedMarket",
    "holdingCompany",
    "agencyOwnershipStructure",
    "winnersRepName",
    "winnersRepJobTitle",
    "winnersRepCompany",
    "winnersEmailAddress",
    "submissionOne",
    "mainWrittenSubmission",
    "submissionTwo",
    "compulsoryImageUploadOne",
    "compulsoryImageUploadTwo",
    "compulsoryImageUploadThree"
  ],
  "properties": {
    "usefulLinks":{
      "title":"USEFUL LINKS",
      "type":"string",
      "list":[
        {"type":"string","primary":"Entry Kit: <a href='#'>Download Here</a>"},
        {"type":"string","primary":"Entry Template: Download Here"},
        {"type":"string","primary":"Endorsement Letter:  Download Here"},
      ]
    },
    "breakOne":{
      "type": "string"
    },
    "creditsSectionTitle":{
      "title":"Credits Section",
      "type":"string"
    },
    "important":{
      "title":"IMPORTANT",
      "type":"string",
      "list":[
        {"type":"string","primary":"All information below are mandatory and in English only."},
        {"type":"string","primary":"Please ensure all credits are correctly filled in. Once submitted, these cannot be changed."},
        {"type":"string","primary":"In case of any request, changes can only be considered and prior approval with a fee to be charged. Please refer to the entry kit 'credits' page for all details"},
      ]
    },
    "pleaseNote":{
      "title":"Please note that the selected category cannot be changed once the entry has been submitted.",
      "type":"string"
    },
    "confirmEnter":{
      "type": "boolean",
      "title":"I confirm that this is the category I would like to enter for"
    },
    "creditedNominee":{
      "type": "string",
      "title": "Credited Nominee"
    },
    "creditedAgency":{
      "type": "string",
      "title": "Credited Agency"
    },
    "creditedMarket":{
      "type": "string",
      "title": "Credited Market",
      "enum":[
        "Micronesia",
        "Mongolia",
        "Myanmar",
        "Nauru",
        "Nepal",
        "New Zealand",
        "Pakistan",
        "Palau",
        "Papua New Guinea",
        "Philippines",
        "Samoa",
        "Singapore",
        "Solomon Islands",
        "South Korea",
        "Sri Lanka",
        "Taiwan",
        "Thailand",
        "Timor-Leste",
        "Tonga",
        "Tuvalu",
        "Vanuatu",
        "Vietnam"
      ]
    },
    "holdingCompany":{
      "type": "string",
      "title": "Holding Company"
    },
    "agencyOwnershipStructure":{
      "type":"number",
      "title":"Agency Ownership Structure (%)"
    },
    "executiveSummary":{
      "type": "string",
      "title": "Executive Summary (100-150 words)"
    },
    "breakTwo":{
      "type": "string"
    },
    "winnerRep":{
      "title":"WINNER REP",
      "type":"string",
      "list":[
        {"type":"string","primary":"Should your entry win, we will use the below winner representative to go on stage to collect the trophy at gala night. For the People/Team categories, the representative must be the nominee."},
        {"type":"string","primary":"NOTE: Should there be no representative provided, the Organiser will use ‘The Team’ to address the representative to go on stage."},
      ]
    },
    "winnersRepName":{
      "type": "string",
      "title": "Winner's Rep Name"
    },
    "winnersRepJobTitle":{
      "type": "string",
      "title": "Winner's Rep Job Title"
    },
    "winnersRepCompany":{
      "type": "string",
      "title": "Winner's Rep Company"
    },
    "winnersEmailAddress":{
      "type": "string",
      "title": "Winner's Email Address",
      "format": "email"
    },
    "breakThree":{
      "type": "string"
    },
    "entrySubmission":{
      "title":"WRITTEN ENTRY SUBMISSION",
      "type":"string",
      "list":[
        {"type":"string","primary":"Template: Entries which are not prepared as per requirements in the specified template may be disqualified and will not proceed to judging ."},
        {"type":"string","primary":"Endorsement: All entries must complete the 2-step endorsement. Failure to do so may result in disqualification."},
        {"type":"string","primary":"Please refer to the Entry Kit page x for details on written submission and endorsement."}
      ]
    },
    "submissionOne": {
      "type": "string",
      "title": "Upload (PDF, no larger than 5MB) *"
    },
    "breakFour":{
      "type": "string"
    },
    "mainWrittenSubmissionTitle":{
      "type":"string",
      "title":"Do you wish to receive timely news and offers from us, via email to your specified address?"
    },
    "mainWrittenSubmission":{
      "type":"array",
      "title":"required",
      "items":{
        "type":"string",
        "enum": [
          "max10_A4size",
          "confidential"
        ],
        "enumNames": [
          "I confirm the main written submission is maximum 10 single sided pages and in A4 size",
          "I confirm the confidential information is marked in yellow highlighted on written entry"
        ]
      },
      "uniqueItems": true
    },
    "submissionTwo": {
      "type": "string",
      "format": "data-url",
      "description": "Upload (PDF, no larger than 5MB) *"
    },
    "endoresmentLetterTitle":{
      "type":"string",
      "title":"Endorsement Letter"
    },
    "confirmEndoresment":{
      "type": "boolean",
      "title":"I confirm the entry has been endoresed by CEO and CFO"
    },
    "breakFive":{
      "type": "string"
    },
    "compulsoryImage":{
      "title":"COMPULSORY IMAGES",
      "type":"string",
      "list":[
        {"type":"string","primary":"Mandatory Images: Three (3) images in high resolution (300 dpi) are required for all categories and if the entry is awarded, these will be used to showcase your entry."},
        {"type":"string","primary":"For more details on requirement, please please refer to the Entry Kit page xx."},
      ]
    },
    "compulsoryImageUploadOne": {
      "type": "string",
      "format": "data-url",
      "title":"Image Upload 1",
      "description": "Upload (JPEG, PNG; no larger than 2MB) *",
    },
    "compulsoryImageUploadTwo": {
      "type": "string",
      "format": "data-url",
      "title":"Image Upload 2",
      "description": "Upload (JPEG, PNG; no larger than 2MB) *",
    },
    "compulsoryImageUploadThree": {
      "type": "string",
      "format": "data-url",
      "title":"Image Upload 3",
      "description": "Upload (JPEG, PNG; no larger than 2MB) *",
    },
    "breakSix":{
      "type": "string"
    },
    "supportingMaterials":{
      "title":"SUPPORTING MATERIALS (OPTIONAL)",
      "type":"string",
      "list":[
        {"type":"string","primary":"Format: PDF, PNG, JPEG"},
        {"type":"string","primary":"File Size: Maximum 5MB"},
        {"type":"string","primary":"Video/Microsite: URL (Platform i.e. YouTube, Vimeo, Youku)"},
      ]
    },
    "supportingMaterialsCaption":{
      "type":"string",
      "title":"Supporting materials are recommended limiting to 15 pages/ 3 minutes for video."
    },
    
    "supportingOneImageVideoTitle":{
      "type":"string",
      "title":"Supporting Material Type 1: (Either video url or file upload)"
    },
    "supportingOneUrl": {
      "type": "string",
      "title": "URL"
    },
    "supportingOneUsername": {
      "type": "string",
      "title": "Username",
      "description":"Optional"
    },
    "supportingOnePassword": {
      "type": "string",
      "title": "Password",
      "description":"Optional"
    },
    "supportingOneFileTitle":{
      "type":"string",
      "title":"Or Upload Supporting File"
    },
    "supportingOneFile":{
      "type":"string",
      "title":"Supporting File Upload"
    },


    "supportingTwoImageVideoTitle":{
      "type":"string",
      "title":"Supporting Material Type 2: (Either video url or file upload)"
    },
    "supportingTwoUrl": {
      "type": "string",
      "title": "URL"
    },
    "supportingTwoUsername": {
      "type": "string",
      "title": "Username",
      "description":"Optional"
    },
    "supportingTwoPassword": {
      "type": "string",
      "title": "Password",
      "description":"Optional"
    },
    "supportingTwoFileTitle":{
      "type":"string",
      "title":"Or Upload Supporting File"
    },
    "supportingTwoFile":{
      "type":"string",
      "title":"Supporting File Upload"
    },



    "supportingThreeImageVideoTitle":{
      "type":"string",
      "title":"Supporting Material Type 3: (Either video url or file upload)"
    },
    "supportingThreeUrl": {
      "type": "string",
      "title": "URL"
    },
    "supportingThreeUsername": {
      "type": "string",
      "title": "Username",
      "description":"Optional"
    },
    "supportingThreePassword": {
      "type": "string",
      "title": "Password",
      "description":"Optional"
    },
    "supportingThreeFileTitle":{
      "type":"string",
      "title":"Or Upload Supporting File"
    },
    "supportingThreeFile":{
      "type":"string",
      "title":"Supporting File Upload"
    },
    "breakEnd":{
      "type": "string"
    }
  }
};

const entryUiSchema = {
  "usefulLinks":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "breakOne":{"ui:widget":Break},
  "creditsSectionTitle":{"ui:widget":CustomTypography,"variant":'h3'},
  "important":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "pleaseNote":{"ui:widget":CustomTypography,"variant":'h4'},
  "creditedNominee":{"ui:description": "For team entry, please specify with \"[Team]\" at the end of your team name, i.e. Communication Team [Team]"},
  "executiveSummary":{"ui:widget": "textarea"},
  "breakTwo":{"ui:widget":Break},
  "winnerRep":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "entrySubmission":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "breakThree":{"ui:widget":Break},
  "mainWrittenSubmission":{"ui:widget":"checkboxes"},
  "mainWrittenSubmissionTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "endoresmentLetterTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "breakFour":{"ui:widget":Break},
  "breakFive":{"ui:widget":Break},
  "compulsoryImage":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "breakSix":{"ui:widget":Break},
  "supportingMaterials":{"ui:widget":CustomList,"dense":true, "icon":true, "variant":'h4'},
  "supportingMaterialsCaption":{"ui:widget":CustomTypography,"variant":'h4'},
  "supportingMaterialsUrls":{"ui:widget": "textarea"},
  "submissionOne":{"ui:widget":S3Uploader},
  
  "supportingOneImageVideoTitle":{"ui:widget":CustomTypography,"variant":'body1'},
  "imageUploadSupportingOneVideoTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingOneUsername": {'xs':12, 'md':6},
  "supportingOnePassword": {'xs':12, 'md':6},
  "supportingOneFileTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingOneFile":{"ui:widget":S3Uploader},

  "supportingTwoImageVideoTitle":{"ui:widget":CustomTypography,"variant":'body1'},
  "imageUploadSupportingTwoVideoTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingTwoUsername": {'xs':12, 'md':6},
  "supportingTwoPassword": {'xs':12, 'md':6},
  "supportingTwoFileTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingTwoFile":{"ui:widget":S3Uploader},


  "supportingThreeImageVideoTitle":{"ui:widget":CustomTypography,"variant":'body1'},
  "imageUploadSupportingThreeVideoTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingThreeUsername": {'xs':12, 'md':6},
  "supportingThreePassword": {'xs':12, 'md':6},
  "supportingThreeFileTitle":{"ui:widget":CustomTypography,"variant":'subtitle2'},
  "supportingThreeFile":{"ui:widget":S3Uploader},

  "firstName": {'xs':12, 'md':6},
  "lastName": {'xs':12, 'md':6},
  "city":{'xs':12, 'md':6},
  "state":{'xs':12, 'md':6},
  "zipcode":{'xs':12, 'md':6},
  "country":{'xs':12, 'md':6},
  "phonePrefix":{'xs':5, 'md':5},
  "phone":{'xs':7,'md':7},
  "mobilePhonePrefix":{'xs':5, 'md':5},
  "mobilePhone":{'xs':7, 'md':7},
  "typeOfCompanyTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "howKnowAoyTitle":{"ui:widget":CustomTypography,"variant":'subtitle1'},
  "reciveNewsOffers":{"ui:widget": "checkboxes"},
  "termsTitle":{"ui:widget":CustomTypography,"variant":'body1'},
  "aliasCode":{"ui:widget":"hidden"},
  "password": {
    "ui:widget": "password"
  },
  "breakEnd":{"ui:widget":Break}
};

const entryFormData = {
  "confirmEnter":true,
  "confirmEndoresment":true
}

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(3, 0),
  },
  container:{
    maxWidth:'500px',
    margin:'0 auto'
  }
  
}));

const FormPage = (props) => {
  
  const parsed = queryString.parse(window.location.search);
  const {step} = useParams();
  const classes = useStyles();
  const { isAuthenticated, user, isLoading } = useAuth0();
  const namespace = process.env.REACT_APP_AUTHO_NAMESPACE;

  const awardid = parsed.aliasCode || process.env.REACT_APP_AWARD_CODE;



  useEffect(() => {
    const fn = async () => {
      if (!isLoading) {
        if (user) {
          console.log(user);
        }
      } else {

      }
    };
    fn();
  }, [isAuthenticated, isLoading]);

  const submitData = (data) =>{
    console.log(data.formData);
    alert(JSON.stringify(data.formData));
  }

  return (
    <Container maxWidth={'lg'}>
      <div className={classes.root}>
        <Grid className={classes.container}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Typography variant='h4' gutterBottom>Demo</Typography>
            {step && (step==='step1') &&
              <Form schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={console.log("changed")}
                onSubmit={submitData}
                onError={console.log("errors")} 
                ObjectFieldTemplate={CustomFieldTemplate}
                >
                <div>
                  <Button type="submit" variant="contained">Save</Button>
                  <Button type="button">Cancel</Button>
                </div>
              </Form>
            }
            {step && (step==='step2') &&
              <Form schema={schemaSelect}
                onChange={console.log("changed")}
                onSubmit={submitData}
                onError={console.log("errors")} 
                >
                <div>
                  <Button type="submit" variant="contained">Select</Button>
                  <Button type="button">Cancel</Button>
                </div>
              </Form>
            }
            {step && (step==='step3') &&
              <Form schema={schemaEntry}
                onChange={console.log("changed")}
                uiSchema={entryUiSchema}
                formData={entryFormData}
                ObjectFieldTemplate={CustomFieldTemplate}
                onSubmit={submitData}
                onError={console.log("errors")} 
                >
                <div>
                  <Button type="submit" variant="contained">Submit</Button>
                  <Button type="button">Cancel</Button>
                </div>
              </Form>
            }
            {step && (step==='test') &&
              <Form schema={testSchema}
                uiSchema={testUiSchema}
                onError={console.log("errors")} 
                >
                <div>
                  <Button type="submit" variant="contained">Submit</Button>
                  <Button type="button">Cancel</Button>
                </div>
              </Form>
            }
          </Grid>
        </Grid>
      </div>
    </Container>
  );
     

};

export default inject((stores) => ({
  stepStore: stores.store.stepStore
}))(observer(FormPage));
