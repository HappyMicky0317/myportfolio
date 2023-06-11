import skills from './skills'

export default class SkillsRender {

    domElements = {
        skillsRenderContainer: document.getElementById('about-skills-render-container'),
    }

    constructor() {
        this.skills = skills

        this.renderSkills()
    }

    renderSkills() {
        this.skills.forEach((skill) => {
            this.domElements.skillsRenderContainer.insertAdjacentHTML('beforeend', `
                <div id="about-skill-container-${this.skills.indexOf(skill)}" class="row about-skill-container">
                    <span id="about-skill-span-${this.skills.indexOf(skill)}" class="about-skill-span">${skill.name}</span>
                    <div class="about-skill-bar-container">
                        <div id="about-skill-bar-${this.skills.indexOf(skill)}" class="about-skill-bar" style="width: ${skill.width}"></div>
                    </div>
                </div>
            `)
        })
    }
}