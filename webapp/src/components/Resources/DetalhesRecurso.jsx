import React, { useState, useEffect } from 'react';
import './Recursos.css';
import { Container, Row, Col, Button } from 'reactstrap';
import RecursosEdSearch from './RecursosEdSearch';
import { useHistory, useParams } from 'react-router-dom';
// React Twitter Embed:
import { TwitterShareButton } from 'react-twitter-embed';
// https://www.npmjs.com/package/react-twitter-embed
import m3_resources from '../../xml/m3_resources.js'

function DetalhesRecurso() {

    // O history funciona como uma pilha para armazenar as rotas e o params contém as informações da rota atual
    const history = useHistory()
    const {idRecurso} = useParams()
     


    // INFORMAÇÕES SOBRE O RECURSO:
    // Parser
    const parser = new DOMParser();
    const parsedResources = parser.parseFromString(m3_resources,"text/xml");

    // Array com todos os recursos
    const rawResourcesArray = [...parsedResources.getElementsByTagName("m3_resource")]
    console.log(rawResourcesArray)
    const resourcesArray = rawResourcesArray.map(rawResource => ({
        id: rawResource.childNodes[1].textContent,
        title: rawResource.childNodes[9].textContent,
        m3_media_id: rawResource.childNodes[3].textContent,
        topic: rawResource.childNodes[41].textContent,
        serie: rawResource.childNodes[5].textContent,
        synopsis: rawResource.childNodes[13].textContent,
        objectives: rawResource.childNodes[15].textContent,
        tags: rawResource.childNodes[37].textContent,
        duration: rawResource.childNodes[11].textContent,
        authors: rawResource.childNodes[35].textContent,
        youtube_link: rawResource.childNodes[33].textContent,
    }))

    // Objeto do recurso específico com todas as suas informações
    const resource = resourcesArray.find(resource => resource.id === idRecurso);

    return (
        <Container className="home-container">
            {/* Voltar + Busca*/}
            <Row className="home-row">
                <Col className="home-col">
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <Button className="button" style={{marginRight: "10px"}} onClick={() => history.goBack()}> 
                            <p> VOLTAR </p> 
                        </Button>
                        <RecursosEdSearch setSearchValue={(value) => {
                            if (value.length === 0) {
                                history.push(`/recursos`)
                            } else {
                                history.push(`/recursos?search=${value}`)
                            }
                        }}/>
                    </div>
                </Col>
            </Row>

            {/* Cabeçalho: título, tema, série e mídia */}
            <Row className= "home-row">
                <Col className= "home-col">
                    <h2> {resource.title} </h2>
                    <div  style={{marginTop: "10px"}}>
                        {
                            // Lembrar que dei replace no banco de <m3_serie_id></m3_serie_id> para <m3_serie_id>null</m3_serie_id>
                            resource.serie === "null"?
                                <p> 
                                    <span style={{color: "#ee2d32", textTransform: "uppercase"}} > {resource.topic}  </span>
                                </p>
                            :
                                <p> 
                                    <span style={{color: "#ee2d32", textTransform: "uppercase"}} > {resource.topic}  </span>
                                    <span> • Série: {resource.serie} </span> 
                                </p>
                        }
                    </div>
                </Col>
                <Col className= "home-col icon-alignment">
                    <p style={{marginLeft: "auto"}}> {resource.m3_media_id} </p>
                </Col>
            </Row>
            <div className="divider" style={{marginTop: "-15px", marginBottom: "30px"}}/>


            <Row className="home-row">

                {/* Card de sinopse, objetivos, conteúdos, créditos */}
                <Col md="5" sm="12" className= "home-col">
                    <div className="details-card">

                        <h3> Duração </h3>
                        <p> {resource.duration} </p>
                        <h3> Objetivos </h3>
                        <p> {resource.objectives} </p>
                        <h3> Conteúdos </h3>
                        <p> {resource.tags} </p>
                        <h3> Créditos </h3>
                        <p style={{paddingBottom: "20px"}}> {resource.authors} </p>
                    </div>
                </Col>

                {/* Card com arquivos, guia do professor e como usar */}
                {/* O card exibido depende de qual é a mídia do recurso específico */}
                <Col md="7" sm="12" className="downloads-area">
                    {/* Experimentos */}
                    {
                        resource.m3_media_id === "Experimento"?
                            <DetalhesExperimento resource={resource}/>
                        :
                            null
                    }
                    {/* Vídeos */}
                    {
                        resource.m3_media_id === "Vídeo"?
                            <DetalhesVideo resource={resource}/>
                        :
                            null
                    }
                    {/* Softwares */}
                    {
                        resource.m3_media_id === "Software"?
                            <DetalhesSoftware resource={resource}/>
                        :
                            null
                    }
                    {/* Áudios */}
                    {
                        resource.m3_media_id === "Áudio"?
                            <DetalhesAudio resource={resource}/>
                        :
                            null
                    }

                    {/* Botão de compartilhamento do twitter */}
                    <div className="centerContent" style={{paddingTop: "40px"}}>
                        <div className="selfCenter">
                            <TwitterShareButton url={`https://m3.ime.unicamp.br/recursos/${resource.id}`} options={{
                                text: '#M3',
                                via: 'matematicam3',
                                size: 'large',
                            }} placeholder="Loading" />
                        </div>
                    </div>
                </Col>
            </Row>


            <div className="divider" style={{marginTop: "30px"}}/>
        </Container>
    )
}

const DetalhesExperimento = ({resource}) => {
    return(
        <>
            <h3 style={{paddingTop: "20px"}}> Sinopse </h3>
            <p> {resource.synopsis} </p>

            <h3 style={{paddingTop: "40px"}}> Roteiro do Experimento </h3>
            <p> 
                Duas versões. A primeira, adequada para impressão caseira.
                <br/>
                A segunda, para visualização em tela.
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para impressão </a>
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para tela </a>
            </p>

            <h3 style={{paddingTop: "40px"}}> Guia do professor </h3>
            <p> 
                Duas versões. A primeira, adequada para impressão caseira.
                <br/>
                A segunda, para visualização em tela.
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para impressão </a>
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para tela </a>
            </p>

            <h3 style={{paddingTop: "40px"}}> Folha do aluno </h3>
            <p> 
                Apenas uma versão, que deve ser impressa, fotocopiada e distribuída aos alunos, mas que pode também ser visualizada em tela.
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para impressão </a>
            </p>
        </>
    )
}

const DetalhesVideo = ({resource}) => {
    return(
        <>
            <div class="iframe-container">
                <iframe 
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${resource.youtube_link}`}
                    frameborder="0" 
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            </div>

            <h3 style={{paddingTop: "40px"}}> Sinopse </h3>
            <p> {resource.synopsis} </p>

            <h3 style={{paddingTop: "40px"}}> Vídeo </h3>
            <p> 
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> vídeo completo </a>
            </p>

            <h3 style={{paddingTop: "40px"}}> Guia do professor </h3>
            <p> 
                Apenas uma versão para visualização em tela.
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para tela </a>
            </p>
        </>
    )
}

const DetalhesSoftware = ({resource}) => {
    return(
        <>
            <a href={`https://m3.ime.unicamp.br/media/software/${resource.id}/`} target="_blank" rel="noopener noreferrer">
                <Button className="button" style={{paddingTop: "20px"}}> 
                    <p> USAR NA INTERNET </p> 
                </Button>
            </a>
            <p style={{paddingTop: "10px"}}>
                Clique acima para entrar no software agora mesmo.
            </p>

            <h3 style={{paddingTop: "40px"}}> Sinopse </h3>
            <p> {resource.synopsis} </p>

            <h3 style={{paddingTop: "40px"}}> Guia do professor </h3>
            <p> 
                Duas versões. A primeira, adequada para impressão caseira.
                <br/>
                A segunda, para visualização em tela.
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para impressão </a>
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para tela </a>
            </p>
        </>
    )
}

const DetalhesAudio = ({resource}) => {
    return(
        <>  
            <h6> Primeiro módulo </h6>
            <audio controls style={{paddingTop: "10px"}}>
                <source src="horse.mp3" type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>

            <h6 style={{paddingTop: "20px"}}> Segundo módulo </h6>
            <audio controls style={{paddingTop: "10px"}}>
                <source src="horse.mp3" type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>

            <h3 style={{paddingTop: "40px"}}> Sinopse </h3>
            <p> {resource.synopsis} </p>

            <h3 style={{paddingTop: "40px"}}> Áudios </h3>
            <p> 
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> primeiro módulo </a>
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> segundo módulo </a>
            </p>

            <h3 style={{paddingTop: "40px"}}> Guia do professor </h3>
            <p> 
                Apenas uma versão para visualização em tela
                <br/>
                — <a href="null" target="_blank" rel="noopener noreferrer" className= "downloads"> versão para tela </a>
            </p>
        </>
    )
}

export default DetalhesRecurso