var dingSound = new Audio('sounds/ding.mp3');
var scribbleSound = new Audio('sounds/scribble.mp3');
var binToss = new Audio('sounds/binToss.mp3');


function addTodo() {
    var input = document.getElementById('todo-input');
    var todoText = input.value.trim();
    if (todoText) {
        appendTaskToList('todo-list', todoText);
        input.value = '';
        dingSound.play();
    }
}

function appendTaskToList(listId, taskText) {
    var ul = document.getElementById(listId);
    var li = document.createElement('li');
    li.textContent = taskText;
    li.onclick = function() {
        this.classList.toggle('completed');
        scribbleSound.play();
    };
    ul.appendChild(li);
}

function clearCompletedTasks() {
    var ul = document.getElementById('todo-list');
    var completedTasks = ul.querySelectorAll('.completed');
    completedTasks.forEach(task => task.remove());
    binToss.play();
}

function showAlertModal(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'flex'; // Make sure this matches your modal's display style for visibility
}

function closeAlertModal() {
    document.getElementById('alertModal').style.display = 'none';
}

function showMainScreen() {
    document.getElementById('template-loader-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'none';
    document.getElementById('template-creator-screen').style.display = 'none';
    document.getElementById('template-deleter-screen').style.display = 'none';
    document.getElementById('todo-list-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
}

function showTemplateOptions() {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('template-creator-screen').style.display = 'none';
    document.getElementById('template-loader-screen').style.display = 'none';
    document.getElementById('template-deleter-screen').style.display = 'none';
    document.getElementById('todo-list-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'block';
}

function showTemplateCreator() {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'none';
    document.getElementById('template-loader-screen').style.display = 'none';
    document.getElementById('template-deleter-screen').style.display = 'none';
    document.getElementById('todo-list-screen').style.display = 'none';
    document.getElementById('template-creator-screen').style.display = 'block';
}



function addTemplateTask() {
    var input = document.getElementById('template-task-input');
    var taskText = input.value.trim();
    if (taskText) {
        var ul = document.getElementById('template-tasks');
        var li = document.createElement('li');
        
        var span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            ul.removeChild(li);
            binToss.play();
        };

        li.appendChild(removeButton);
        ul.appendChild(li);

        input.value = ''; // Clear the input field
        dingSound.play();
    }
}

function saveTemplate() {
    var templateNameInput = document.getElementById('template-name-input');
    var templateName = templateNameInput.value.trim();
    var ul = document.getElementById('template-tasks');
    var tasks = [];
    
    ul.childNodes.forEach(function(li) {
        // Only add tasks, not the remove buttons
        if (li.nodeType === Node.ELEMENT_NODE) {
            tasks.push(li.firstChild.textContent); // Assuming the first child is the text
        }
    });
    
    if (!templateName) {
        showAlertModal('Please enter a template name.');
        return;
    }
    
    if (tasks.length === 0) {
        showAlertModal('Please add some tasks to the template.');
        return;
    }
    
    var templates = JSON.parse(localStorage.getItem('templates')) || {};
    templates[templateName] = tasks;
    localStorage.setItem('templates', JSON.stringify(templates));
    showAlertModal('Template "' + templateName + '" has been saved.');
}

function showTemplateLoader() {
    var templates = JSON.parse(localStorage.getItem('templates')) || {};
    var list = document.getElementById('load-template-list'); // Assume this is the ID for your load list in HTML
    list.innerHTML = ''; // Clear the list first

    Object.keys(templates).forEach(function(templateName) {
        var li = document.createElement('li');
        li.textContent = templateName;
        li.onclick = function() {
            loadTemplate(templateName);
            showAlertModal('Template "' + templateName + '" loaded to Task Viewer.');
        };

        list.appendChild(li);
    });

    // Show the template loader screen
    document.getElementById('template-loader-screen').style.display = 'block';
    // Hide other screens
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('template-deleter-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'none';
    document.getElementById('todo-list-screen').style.display = 'none';
}

function loadTemplate(templateName) {
    var templates = JSON.parse(localStorage.getItem('templates')) || {};
    var tasks = templates[templateName];
    if (tasks) {
        // Clear current tasks in the Task Viewer, if necessary
        // document.getElementById('todo-list').innerHTML = '';

        // Add each task from the template to the Task Viewer list
        tasks.forEach(task => appendTaskToList('todo-list', task));
        
        // Display a message indicating the template's tasks have been added to the Task Viewer
        showAlertModal('Template "' + templateName + '" tasks added to Task Viewer.');
    } else {
        // If the template doesn't exist or has no tasks, show an error message
        showAlertModal('Error: Template "' + templateName + '" could not be found or has no tasks.');
    }
}



function showTaskViewer() {
    document.getElementById('todo-list-screen').style.display = 'block';
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'none';
    document.getElementById('template-creator-screen').style.display = 'none';
    document.getElementById('template-deleter-screen').style.display = 'none';
    document.getElementById('template-loader-screen').style.display = 'none';
}


function showTemplateDeleter() {
    var templates = JSON.parse(localStorage.getItem('templates')) || {};
    var list = document.getElementById('template-list'); // Assume this is the ID for your deletion list in HTML
    list.innerHTML = ''; // Clear the list first

    Object.keys(templates).forEach(function(templateName) {
        var li = document.createElement('li');
        li.textContent = templateName + " ";

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            delete templates[templateName];
                localStorage.setItem('templates', JSON.stringify(templates));
                li.remove(); // Remove the template item from the list
                showAlertModal('Template "' + templateName + '" has been deleted.');
                binToss.play();
        };

        li.appendChild(deleteButton);
        list.appendChild(li);
    });

    // Show the template deleter screen
    document.getElementById('template-deleter-screen').style.display = 'block';
    // Hide other screens
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('template-loader-screen').style.display = 'none';
    document.getElementById('template-options-screen').style.display = 'none';
    document.getElementById('todo-list-screen').style.display = 'none';
}


