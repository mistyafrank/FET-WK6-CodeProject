
class Patient {
    constructor(name) {
        this.name = name;
      
    }

}



class PatientService {
    static url = 'https://621c14d6768a4e1020a1b2e5.mockapi.io/patient';

    static getAllPatients() {
        return $.get(this.url);
    }

    static getPatient(patient) {
        return $.get(this.url + `/${patient}`);
    }

    static createPatient(patient) {
        return $.post(this.url, patient.name)
    }

    static updatePatient(patient) {
        return $.ajax({
            url: this.url + `/${patient._id}`,
            dataType: 'json',
            data: JSON.stringify(patient),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deletePatient(patient) {
        return $.ajax({
            url: this.url + `/${patient}`,
            type: 'DELETE'
        });
    }

}

class DOMManager {
    static patients;

    static getAllPatients() {
        PatientService.getAllPatients().then(patients => this.render(patients));
    }

    static createPatient(name) {
        PatientService.createPatient(new Patient(name))
        .then(() => {
            return PatientService.getAllPatients();
        })
        .then((patients) => this.render(patients));
        console.log(new Patient(name));
    }


    static deletePatient(patient) {
        console.log(patient)
        PatientService.deletePatient(patient._id)
        .then(() => {
            return PatientService.getAllPatients();
        })
        .then((patients) => this.render(patients));
    }

    static addPatient(name, id) {
        for (let patient of this.patients) {
            if (patient._id == id) {
                patient.push(new Patient($(`#${id}`).val()))
                patient.push(new Patient($(`#${name}`).val()))
                PatientService.updatePatient(patient.name)
                    
            }
        }
    }


    static render(patients) {
        this.patients = patients;
        $('#app').empty();
        for (let patient of patients) {
            $('#app').prepend(
            `<div id="${patient._id}" class="card">
                <div class="card-header">
                    <h2>${patient.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deletePatient('${patient.name}')">Delete</button>
                </div> 
            </div><br>`
        );
        }
    }
}


$('#create-new-patient').click(() => {
    DOMManager.createPatient($('#new-patient-name').val());
    $('#new-patient-name').val('');
});


DOMManager.getAllPatients();
