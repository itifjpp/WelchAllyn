/* 
    Created on : 22/11/2017, 02:05:50 PM
    Author     : felipe de jesus <itifjpp@gmail.com>
*/
let sv_sis='';
let sv_dis='';
let sv_temp;
let sv_fc='';
let sv_oximetria='';
let paciente_id=0;
let ns=0;
let serial_numers=[];
let nombres=[];
let apellidos=[];
let medico_id='';
$(document).ready(function () {
    var url_api=$('input[name=url_api]').val();
    let time_reload_page=$('input[name=time_reload_page]').val();
    setInterval(function (e) {
        $.ajax({
            url: "CentralMonitoreo.php?action=READ_DIRECTORY&reload="+time_reload_page,
            type: 'GET',
            beforeSend: function (xhr) {
                console.log("COMENZANDO LECTURA DE ARCHIVOS");
            },success: function (response, textStatus, jqXHR) {
                console.log(response)
                if(response.isEmpyDirectory!=0){
                    $.each(response.Files,function (i,xml_file) {
                        $.get("assets/xml/"+xml_file, {}, function (xml){
                            $('MEMBER',xml).each(function(i,e){
                                if($(this).attr('name')=='SerialNumber'){
                                    serial_numers.push($(this).find('VALUE').text());
                                }if($(this).attr('name')=='Systolic'){
                                    sv_sis=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().trim().substr(0,3);
                                }if($(this).attr('name')=='Diastolic'){
                                    sv_dia=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().trim().substr(0,2);
                                }if($(this).attr('name')=='FirstName' ){
                                    nombres.push($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text())
                                }
                                if($(this).attr('name')=='LastName' ){
                                    apellidos.push($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text());
                                }if($(this).attr('name')=='Identifier'){
                                    if($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text()!=''){
                                        paciente_id=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().replace(/\s/g,"");
                                    }


                                }if($(this).attr('name')=='Sat'){
                                    if($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text()!=''){
                                        sv_oximetria=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().replace(/\s/g,"");
                                        let sv_oxi=sv_oximetria.slice(0,sv_oximetria.length-2);
                                        sv_oximetria=sv_oxi;
                                    }
                                }if($(this).attr('name')=='Temperature'){
                                    if($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text()!=''){
                                        sv_temp=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().replace(/\s/g,"");
                                        sv_temp=sv_temp.slice(0,sv_temp.length-2);
                                        sv_temp=Number(sv_temp)-273.15;

                                    }
                                }if($(this).attr('name')=='HR'){
                                    if($(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text()!=''){
                                        sv_fc=$(this).find('VALUE DEFINITION MEMBERS MEMBER VALUE:first').text().replace(/\s/g,"");
                                        sv_fc=sv_fc.slice(0,sv_fc.length-2);
                                    }
                                }if($(this).attr('name')=='IdentifierExt'){
                                    medico_id=$(this).text();
                                }

                            });
                            if(nombres.length==1){
                                nombres.push('');
                                apellidos.push('');
                                console.log('SOLO UNO')
                            }

                            data_sv={
                                
                                sv_sis:sv_sis,
                                sv_dia:sv_dia,
                                sv_fc:sv_fc,
                                sv_temp:sv_temp.toFixed(1),
                                sv_oximetria:sv_oximetria.substr(0,4),
                                equipo_ns:serial_numers[0],
                                sv_key:xml_file,
                                paciente_nombre:nombres[0],
                                paciente_ap:apellidos[0],
                                medico_id:medico_id.replace(/\s/g,""),
                                medico_nombre:nombres[1],
                                medico_ap:apellidos[1],
                                paciente_id:paciente_id
                            }
                            $.ajax({
                                url: url_api,
                                type: 'POST',
                                dataType: 'json',
                                data:data_sv,
                                beforeSend: function (xhr) {
                                    console.log('Enviando datos al servidor...');
                                },success: function (data, textStatus, jqXHR) {
                                    console.log('Datos Enviados al Sevidor');
                                    console.log(data_sv)
                                    $.ajax({
                                        url: "CentralMonitoreo.php?action=REMOVE_FILE",
                                        type: 'POST',
                                        dataType: 'json',
                                        data:{
                                            xml:xml_file
                                        },beforeSend: function (xhr) {
                                            console.log('ELIMINANDO ARCHIVO LOCAL...');
                                        },success: function (data, textStatus, jqXHR) {
                                            console.log('ARCHIVO LOCAL ELIMINADO');
                                        }
                                    })
                                },error: function (e) {
                                    console.log(e)
                                }
                            })
                            nombres=[];
                            apellidos=[];
                        });

                    })
                    if(response.reload=='Si'){
                        location.reload();
                    }
                }
            },error: function (jqXHR, textStatus, errorThrown) {
                console.log('ERROR AL PROCESAR LA PETICIÓN\n\n'+textStatus);
            }
        })    
    },3000);
    
})