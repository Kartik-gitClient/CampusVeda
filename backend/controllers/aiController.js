import * as aiService from '../services/aiService.js';
import Resource from '../models/Resource.js';
import Conflict from '../models/Conflict.js';
import ErrorResponse from '../utils/errorResponse.js';

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return next(new ErrorResponse('Please provide a message', 400));
    }

    // Fetch context data
    const resources = await Resource.find({ type: 'Room', isActive: true })
      .select('name subType status capacity department');
    
    const activeConflicts = await Conflict.find({ status: 'active' })
      .populate({
        path: 'request',
        select: 'resourceName userName startDate endDate'
      });

    const context = {
      availableRooms: resources.filter(r => r.status === 'Available'),
      occupiedRooms: resources.filter(r => r.status === 'In Use'),
      conflicts: activeConflicts.map(c => ({
        type: c.type,
        description: c.description,
        resource: c.request?.resourceName,
        user: c.request?.userName
      }))
    };

    const systemMessage = `
      You are PRITHVEDA AI, the smart campus operations assistant. 
      Your goal is to provide helpful, "sweet", and concise answers (75-150 words) to user queries.
      
      CURRENT CAMPUS CONTEXT:
      - Available Rooms: ${context.availableRooms.map(r => r.name).join(', ') || 'None'}
      - Active Conflicts: ${context.conflicts.length > 0 ? context.conflicts.map(c => `${c.type} on ${c.resource}`).join('; ') : 'None'}
      
      Rules:
      1. Use the specific room names provided.
      2. If asked about availability, suggest the 'Available Rooms'.
      3. If asked about conflicts, explain the status of 'Active Conflicts' simply.
      4. Always be professional, warm, and brief.
    `;

    let aiResponse = await aiService.generateChatCompletion(
        `User Message: ${message}\n\nContext Data: ${JSON.stringify(context)}`,
        systemMessage
    );

    if (!aiResponse) {
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('room') || lowerMsg.includes('availab') || lowerMsg.includes('where') || lowerMsg.includes('venue')) {
        const rooms = context.availableRooms.map(r => r.name).join(', ');
        aiResponse = rooms 
          ? `Right now, we have ${rooms} available! ✨ You can head over to the Building Map to see them in detail. Need help booking one?`
          : `I'm sorry, it looks like all our academic spaces are currently occupied. 🏢 I'll let you know as soon as one becomes free!`;
      } else if (lowerMsg.includes('conflict') || lowerMsg.includes('issue') || lowerMsg.includes('problem')) {
        aiResponse = context.conflicts.length > 0
          ? `We currently have ${context.conflicts.length} active conflict(s), including ${context.conflicts[0].type} on ${context.conflicts[0].resource}. ⚠️ Our team is working to resolve them!`
          : `Good news! There are no active scheduling conflicts at the moment. Everything is running smoothly. ✅`;
      } else {
        aiResponse = `Hello! I'm PRITHVEDA AI. I can help you find available rooms or track any schedule conflicts. Just ask me! 😊 (Note: I am running in local fallback mode as the LLM API is unavailable, but I still have access to your live campus data!)`;
      }
    }
    
    // Note: aiService.suggestConflictResolution is a bit specific, but generateChatCompletion is private.
    // I will modify aiService.js to export a more generic chat function or just use suggestConflictResolution 
    // BUT rename/adjust it for general use.
    
    res.status(200).json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    next(error);
  }
};
