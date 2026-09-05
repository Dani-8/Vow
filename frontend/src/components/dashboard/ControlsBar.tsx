        <button
          onClick={() => onFilterChange('tasks')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'tasks'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Single Tasks
        </button>
        <button
          onClick={() => onFilterChange('todo')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'todo'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'completed'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};
