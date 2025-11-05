# Usability Testing Framework

The Usability Testing Framework is a comprehensive tool for testing website templates with real users and gathering actionable feedback for optimization. It provides a structured approach to usability testing with quantitative metrics and qualitative insights.

## Overview

The framework allows you to:
- Test any of the 8 available templates with demo content
- Define custom test scenarios for specific user tasks
- Collect structured feedback from participants
- Generate quantitative metrics (completion rates, satisfaction scores)
- Export results for further analysis
- Persist test data across sessions

## Key Features

### Template Testing
- **8 Templates Available**: Test all core kits and industry variants
- **Live Preview**: Templates load with realistic demo content applied
- **Responsive Testing**: Test templates in iframe environment

### Test Scenarios
- **Predefined Scenarios**: Common tasks like finding contact info, navigation, forms
- **Custom Scenarios**: Select which tasks to test for each session
- **Structured Testing**: Consistent testing methodology across participants

### Feedback Collection
- **Quantitative Metrics**: 5-star rating system, task completion tracking
- **Qualitative Feedback**: Open-ended questions for detailed insights
- **Participant Tracking**: Record participant names and timestamps

### Results Analysis
- **Real-time Statistics**: Live updates of completion rates and average ratings
- **Feedback Aggregation**: Organized display of all participant feedback
- **Export Functionality**: JSON export for external analysis tools

## How It Works

### Test Session Flow

1. **Setup Phase**
   - Select a template to test
   - Choose test scenarios (checkboxes)
   - Start the test session

2. **Testing Phase**
   - Template loads in iframe with demo content
   - Participants complete assigned tasks
   - Feedback form becomes available

3. **Feedback Collection**
   - Participants rate overall experience (1-5 stars)
   - Indicate task completion level
   - Provide qualitative feedback

4. **Results Analysis**
   - Statistics update in real-time
   - Feedback displays chronologically
   - Export option for further analysis

## Usage Guide

### For Usability Testers

#### Setting Up a Test Session

1. **Select Template**: Click on any template card to choose which design to test
2. **Choose Scenarios**: Check the boxes for tasks you want participants to complete
3. **Start Session**: Click "Start Test Session" to begin

#### During Testing

1. **Guide Participants**: Have users complete the selected scenarios while observing
2. **Collect Feedback**: After each participant finishes, have them fill out the feedback form
3. **Monitor Progress**: Watch real-time statistics update as feedback comes in

#### Analyzing Results

1. **Review Statistics**: Check completion rates and average ratings
2. **Read Feedback**: Review qualitative comments for patterns
3. **Export Data**: Use the export button to save results for further analysis

### For Participants

#### Taking a Usability Test

1. **Read Instructions**: Follow the test scenarios provided
2. **Complete Tasks**: Try to accomplish each checked task using the website
3. **Provide Feedback**:
   - Rate your overall experience (1-5 stars)
   - Indicate how well you completed the tasks
   - Share what worked well and what could be improved
   - Add any additional comments

## Test Scenarios

The framework includes these predefined scenarios:

- **Find company contact information** - Locate phone, email, address
- **Navigate to services section** - Find and access service offerings
- **Locate pricing information** - Find pricing details and plans
- **Submit contact form** - Complete and submit the contact form
- **Find testimonials/reviews** - Locate customer testimonials

## Metrics and Analysis

### Quantitative Metrics

- **Average Rating**: Mean satisfaction score (1-5 scale)
- **Completion Rate**: Percentage of participants who successfully completed all tasks
- **Task Completion Levels**:
  - Completed: All tasks finished successfully
  - Partial: Some tasks completed with difficulty
  - Failed: Unable to complete tasks

### Qualitative Analysis

- **Positive Feedback**: What participants found easy or enjoyable
- **Improvement Areas**: Pain points and confusing elements
- **Additional Comments**: Miscellaneous observations and suggestions

## Data Storage

### Local Storage
- Test results persist in browser localStorage
- Data survives page refreshes and browser restarts
- Automatic saving after each feedback submission

### Export Format
Results export as JSON with the following structure:

```json
{
  "testSession": {
    "template": "starter",
    "scenarios": ["Find contact info", "Navigate to services"],
    "startTime": "2024-01-15T10:30:00Z"
  },
  "feedbackData": [
    {
      "participant": "John Doe",
      "rating": 4,
      "completion": "completed",
      "positive": "Easy navigation",
      "improvements": "Contact form could be clearer",
      "comments": "Great overall design",
      "timestamp": "2024-01-15T10:45:00Z",
      "template": "starter",
      "scenarios": ["Find contact info", "Navigate to services"]
    }
  ],
  "exportDate": "2024-01-15T11:00:00Z",
  "summary": {
    "totalParticipants": 1,
    "averageRating": 4.0,
    "completionRate": 1.0
  }
}
```

## Best Practices

### Test Planning

- **Define Clear Goals**: Know what aspects of the template you want to test
- **Select Appropriate Scenarios**: Choose tasks relevant to your target users
- **Recruit Diverse Participants**: Include users with varying levels of tech-savviness

### During Testing

- **Minimize Interference**: Let participants work independently when possible
- **Take Notes**: Record observations beyond the structured feedback
- **Time Tasks**: Note how long participants take to complete tasks

### Analysis

- **Look for Patterns**: Identify common issues across multiple participants
- **Prioritize Issues**: Focus on problems that affect task completion
- **Consider Context**: Remember that some "issues" may be by design

## Technical Details

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage API for data persistence
- fetch API for loading templates

### Security Considerations
- All data stored locally in browser
- No external data transmission
- Template content loaded via same-origin or CORS-enabled sources

### Performance
- Templates cached after first load
- Efficient DOM manipulation
- Minimal memory footprint

## Troubleshooting

### Template Not Loading
- Check network connectivity
- Verify template file paths
- Ensure CORS headers if loading from different domain

### Data Not Saving
- Check browser localStorage availability
- Clear browser data if storage is full
- Try different browser if issues persist

### Export Not Working
- Check browser download permissions
- Ensure JSON files are allowed to download
- Try different browser if issues persist

## Integration with Other Tools

### Analytics Integration
Results can be imported into analytics tools like Google Analytics or Mixpanel for further analysis.

### A/B Testing
Use the framework to compare different template variations or design iterations.

### Heatmap Tools
Combine with tools like Hotjar or Crazy Egg for click tracking during usability tests.

## Future Enhancements

- Remote testing capabilities
- Video recording integration
- Advanced analytics dashboard
- Automated report generation
- Integration with popular usability testing platforms

## Keyboard Shortcuts

- `Ctrl/Cmd + R`: Reset all test data
- `Ctrl/Cmd + E`: Export results

## Support

For technical issues or feature requests, please refer to the main project documentation or contact the development team.
