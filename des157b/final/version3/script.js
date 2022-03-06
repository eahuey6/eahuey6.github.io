
(function(){
    
    'add strict'

    Parse.initialize("HCbN20xBtm13L18iP6BMhZGX0tLkuVpT5FOQkPxm","OEiLitWJqUja2UHjd8bLefjLDzeMXJ1chinz5Q25");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    const submitBtn = document.getElementById('submitBtn');
    const gallerySection = document.querySelector('#gallery');
    const addAffirmationForm = document.getElementById('addAffirmation-form');
    const inputs = document.querySelectorAll('.responses:not([type=radio');

    let persons = document.getElementsByName("person");
    let chosenPerson;


    const stripes = document.getElementById('stripes');

    const logoBtn = document.getElementById('logo');
    const affirmationNav = document.getElementById('affirmation-btn');
    const galleryNav = document.getElementById('gallery-btn');


    // get pages
    const landingPage = document.getElementById('landingPage');
    const formPage = document.getElementById('formPage');
    const galleryPage = document.getElementById('galleryPage');
    const thankPage = document.getElementById('thankPage');

    // landing page 
    const affirmationBtnHome = document.getElementById('affirmationBtn-home');
    const galleryBtnHome = document.getElementById('galleryBtn-home');

    // thank page 
    const galleryBtnThank = document.getElementById('goGallery-btn');
    const entryBtnThank = document.getElementById('entry-btn');

    
    
    // ------------------NAV BAR CODE------------------------
    logoBtn.addEventListener('click', function(){
        landingPage.className = 'showing';
        galleryPage.className = 'hidden';
        thankPage.className = 'hidden';
        formPage.className = 'hidden';
    })

    affirmationNav.addEventListener('click', function(){
        landingPage.className = 'hidden';
        galleryPage.className = 'hidden';
        thankPage.className = 'hidden';
        formPage.className = 'showing';
    })

    galleryNav.addEventListener('click', function(){
        landingPage.className = 'hidden';
        galleryPage.className = 'showing';
        thankPage.className = 'hidden';
        formPage.className = 'hidden';
        startGalleryPage()
        
    })



    // ------------------LANDING PAGE CODE------------------------

    affirmationBtnHome.addEventListener('click', function(){
        landingPage.className = 'hidden';
        formPage.className = 'showing';
    })

    galleryBtnHome.addEventListener('click', function(){
        landingPage.className = 'hidden';
        galleryPage.className = 'showing';
        startGalleryPage()
    })




    // ------------------FORM PAGE CODE------------------------
    // stripe code
    let pageHeight = document.body.clientHeight;
    stripes.style.height = `${pageHeight}px`;

    // add affirmation to b4a 

    addAffirmationForm.addEventListener('submit', function(event){
        event.preventDefault();
        addAffirmation();
        thankPage.className = 'showing';
        formPage.className = 'hidden';
        console.log('test');
    });

    async function addAffirmation() {
        console.log('test2');
        const newAffirmation = {};


        for (let i=0; i<inputs.length; i++) {
            let key = inputs[i].getAttribute('name');
            let value = inputs[i].value;
            newAffirmation[key] = value;
        }

        for (let i of persons) {
            if (i.checked){
                chosenPerson = i.id;
            }
        }

        if (newAffirmation.address != ""  && newAffirmation.text != "" && newAffirmation.person != ""){
            const newAffirmationData = new Parse.Object('Affirmations');

            newAffirmationData.set('address', newAffirmation.address);
            newAffirmationData.set('text', newAffirmation.text);
            newAffirmationData.set('person', chosenPerson);

            // alert('added');

            try{
                const result = await newAffirmationData.save();

                document.getElementById("addAffirmation-form").reset();

            } catch(error){
                console.error('Error while creating Affirmation', error);
            }

        } else {
            alert('Error while retrieving form. Make sure that all the areas are filled out or selected!');
        }

    }

    // function resetFormFields(){
    //     document.getElementById('address').value = '';
    //     document.getElementById('text').value = '';
    //     document.getElementById('person').value = '';
    // }

    // ------------------THANK YOU PAGE CODE------------------------

    galleryBtnThank.addEventListener('click', function(){
        galleryPage.className = 'showing';
        thankPage.className = 'hidden';
    })
    entryBtnThank.addEventListener('click', function(){
        formPage.className = 'hidden';
        thankPage.className = 'hidden';
    })



    // ------------------GALLERY PAGE CODE------------------------
    async function displayAffirmations(){
        const affirmations = Parse.Object.extend('Affirmations');
        const query = new Parse.Query(affirmations);

        try{

            const results = await query.descending('createdAt').find();
            // console.log(results);

            results.forEach( function(eachAffirmation){
                const id = eachAffirmation.id;
                const address = eachAffirmation.get('address');
                const text = eachAffirmation.get('text');
                const person = eachAffirmation.get('person');
                let cardText;
                let moreBtnTag;

                if (text.length > 230){
                    const slicedText = text.slice(0, 230);
                    cardText = `${slicedText}...`
                    moreBtnTag = '<button class="seeMoreBtn">see more</button>';

                } else {
                    cardText = text;
                    moreBtnTag = '';
                }

                const theArticle = document.createElement('article');
                theArticle.setAttribute('id', `r-${id}`);
                theArticle.className = 'gallery-card';
                theArticle.innerHTML = `
                <section class="card-content">
                    <h3 class="card-address">Dear <br><span class="card-name">${address}</span>, </h3>
                    <p class="card-text">${cardText}</p>
                    ${moreBtnTag}
                </section>
                    `;
                gallerySection.append(theArticle);
            });


            // styles the responsive stripe height on the page
            let pageHeight = document.body.clientHeight;
            stripes.style.height = `${pageHeight}px`;
            console.log(pageHeight);

        } catch (error) {
            console.error('Error while fetching Affirmations', error);
        }
        
    }

    function startGalleryPage(){
        try {
            gallerySection.innerHTML = '';
            displayAffirmations();
    
        } catch(error){
            console.error('Error while creating Affirmation', error);
        }
    }
    






})();